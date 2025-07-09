import { Readable } from 'stream';
import csvParser from 'csv-parser';

import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

import benefitService from './benefit.service.js';

import repository from '../repositories/time-sheet.repository.js';

class TimeSheetsService {
    async getAllRecords() {
        return await repository.findAll();
    }

    async getRecordsByName(name) {
        return await repository.findByName(name);
    }

    async getRecordsByFilters(costCenter, status, startDate, endDate) {
        return await repository.findByFilters(costCenter, status, startDate, endDate);
    }

    async uploadTimeSheet(timeSheet) {
        if (!timeSheet) throw new AppError('O controle de ponto não foi fornecido.');

        const costCenters = await repository.findCostCenter();

        if (!costCenters || costCenters.length === 0) {
            throw new AppError('Não foi possível obter informações de centro de custo.');
        }

        const result = [];
        const stream = Readable.from(timeSheet.toString().replace(/^\uFEFF/, ''));

        await new Promise((resolve, reject) => {
            stream.pipe(csvParser({ separator: ';' }))
                .on('data', (data) => {
                    const removeSpace = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key.trim(), value.trim()])
                    );

                    const [day, month, year] = removeSpace["Período"].split(" - ")[0].split('/');
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                    const employeeName = removeSpace["Nome"].toUpperCase();
                    const employeeMatricula = removeSpace["Matrícula"] === "-" ? null : removeSpace["Matrícula"];

                    const employeeRecord = costCenters.find(cc =>
                        cc.funcionario.toUpperCase() === employeeName
                    );

                    const headers = {
                        periodo: formattedDate,
                        chapa: employeeMatricula,
                        nome: employeeName,
                        jornada_realizada: removeSpace["Jornada realizada"],
                        falta: removeSpace["Falta"] || "NÃO CONSTA",
                        evento_abono: removeSpace["Evento Abono"] || "NÃO CONSTA",
                        centro_custo: employeeRecord ? employeeRecord.centro_custo : 'NÃO CONSTA'
                    };

                    result.push(headers);
                })
                .on('end', () => resolve(result))
                .on('error', (error) => reject(error));
        });

        return await repository.create(result);
    }

    async addExtraDay(timeSheet) {
        if (!timeSheet) throw new AppError('O controle de ponto não foi fornecido.');

        const result = [];
        const stream = Readable.from(timeSheet.toString().replace(/^\uFEFF/, ''));

        await new Promise((resolve, reject) => {
            stream.pipe(csvParser({ separator: ';' }))
                .on('data', (data) => {

                    const removeSpace = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key.trim(), value.trim()])
                    );

                    const hora1 = removeSpace["Hora da Marcação 1"];
                    const hora2 = removeSpace["Hora da Marcação 2"];

                    if (!hora1 || !hora2) return;

                    const [day, month, year] = removeSpace["Data da Marcação"].split('/');
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                    const [firstHour, firstMinute] = hora1.split(':').map(Number);
                    const [secondHour, secondMinute] = hora2.split(':').map(Number);

                    const date1 = new Date(`${year}-${month}-${day}T${firstHour.toString().padStart(2, '0')}:${firstMinute.toString().padStart(2, '0')}:00`);
                    const date2 = new Date(`${year}-${month}-${day}T${secondHour.toString().padStart(2, '0')}:${secondMinute.toString().padStart(2, '0')}:00`);

                    const diffMs = date2 - date1;

                    if (diffMs < 3 * 60 * 60 * 1000) return;

                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    const diffSec = Math.floor((diffMs % (1000 * 60)) / 1000);

                    const jornadaRealizada = `${diffHrs.toString().padStart(2, '0')}:${diffMin.toString().padStart(2, '0')}:${diffSec.toString().padStart(2, '0')}`;

                    const headers = {
                        periodo: formattedDate,
                        chapa: removeSpace["Matrícula"] === "-" ? null : removeSpace["Matrícula"],
                        nome: removeSpace["Nome"].toUpperCase(),
                        jornada_realizada: jornadaRealizada,
                        falta: "NÃO CONSTA",
                        evento_abono: "Dia extra",
                    };

                    result.push(headers);
                })
                .on('end', () => resolve(result))
                .on('error', (error) => reject(error));
        });

        return await repository.create(result);
    }

    async generateLayout(date, workingDays, holidays) {

        if (!date || !workingDays) {
            throw new AppError('Os campos "date" e "workingDays" são obrigatórios.', 400);
        }

        const [yearStr, monthStr] = date.split('-');
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

        const hasDay30 = new Date(year, month - 1, 30).getDate() === 30;

        const day = hasDay30 ? 30 : new Date(year, month, 0).getDate();
        const formattedDate = `${day.toString().padStart(2, '0')}${monthStr}${yearStr}`;

        const rows = [];
        const filename = 'layout_ponto_totvs.txt';
        const employees = await benefitService.findRecord(date, null);

        if (employees.length === 0) {
            throw new AppError('Nenhum colaborador encontrado ou mês inexistente.', 404);
        }

        employees.filter((employee) => employee.contrato === 'CLT').forEach((employee) => {
            const chapa = employee.chapa;
            const absences = this.#absenceCounter(employee.timesheet);

            if (absences > 0) {
                rows.push(`${chapa};${formattedDate};0008;;0000000000${absences.toString().padStart(2, '0')},00;;;;;`);
            }
        });

        employees.filter((employee) => employee.contrato === 'CLT').forEach((employee) => {
            const { chapa, salario, timesheet } = employee;

            const dsr = this.#dsrCounter(timesheet, holidays);
            const absences = this.#absenceCounter(employee.timesheet);
            const discount = (((salario / 100) / 30) * (absences + dsr)).toFixed(2);

            if (absences > 0) {
                rows.push(`${chapa};${formattedDate};9211;;0000000000${dsr.toString().padStart(2, '0')},00;${discount};${discount};;;`);
            }
        });

        if (rows.length === 0) {
            throw new AppError('Nenhuma falta foi encontrada.', 404);
        }

        logger.info(`Arquivo ${filename} gerado com sucesso.`);

        return {
            filename,
            content: rows.join('\n')
        }
    }

    #dsrCounter(timesheet, holidays = []) {
        const weeks = {};

        function getWeekKey(dateStr) {
            const [year, month, day] = dateStr.split('-').map(Number);
            const firstDay = new Date(year, month - 1, 1).getDay();
            const week = Math.ceil((day + firstDay) / 7);
            return `${year}-${month}-${week}`;
        }

        // Marca as semanas dos feriados
        holidays.forEach(dateStr => {
            const key = getWeekKey(dateStr);
            weeks[key] = weeks[key] || { falta: false, feriados: 0 };
            weeks[key].feriados += 1;
        });

        // Marca as semanas com faltas
        timesheet.forEach(ts => {
            if (ts.evento_abono === 'NÃO CONSTA' && ts.jornada_realizada.split(':')[0] < 3) {
                const key = getWeekKey(ts.periodo);
                weeks[key] = weeks[key] || { falta: false, feriados: 0 };
                weeks[key].falta = true;
            }
        });

        // Soma os DSRs
        let dsr = 0;

        Object.values(weeks).forEach(semana => {
            if (semana.falta) {
                dsr += 1 + semana.feriados;
            }
        });

        return dsr;
    }


    #absenceCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'NÃO CONSTA' &&
            value.jornada_realizada.split(':')[0] < 3
        ).length;
    }
}

export default new TimeSheetsService();