import { Readable } from 'stream';
import csvParser from 'csv-parser';

import repository from '../repositories/time-sheet.repository.js';
import AppError from '../utils/errors/AppError.js';

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

    async AddExtraDay(timeSheet) {
        if (!timeSheet) throw new AppError('O controle de ponto não foi fornecido.');

        const result = [];
        const stream = Readable.from(timeSheet.toString().replace(/^\uFEFF/, ''));

        await new Promise((resolve, reject) => {
            stream.pipe(csvParser({ separator: ';' }))
                .on('data', (data) => {

                    const removeSpace = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key.trim(), value.trim()])
                    );

                    // Valida se existem as duas marcações
                    const hora1 = removeSpace["Hora da Marcação 1"];
                    const hora2 = removeSpace["Hora da Marcação 2"];

                    if (!hora1 || !hora2) return; // Ignora se faltar alguma marcação

                    const [day, month, year] = removeSpace["Data da Marcação"].split('/');
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                    const [firstHour, firstMinute] = hora1.split(':').map(Number);
                    const [secondHour, secondMinute] = hora2.split(':').map(Number);

                    const date1 = new Date(`${year}-${month}-${day}T${firstHour.toString().padStart(2, '0')}:${firstMinute.toString().padStart(2, '0')}:00`);
                    const date2 = new Date(`${year}-${month}-${day}T${secondHour.toString().padStart(2, '0')}:${secondMinute.toString().padStart(2, '0')}:00`);

                    const diffMs = date2 - date1;

                    // Verifica se o tempo é negativo ou menor que 3 horas (10800000 ms)
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
}

export default new TimeSheetsService();