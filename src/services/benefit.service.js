import AppError from '../utils/errors/AppError.js';

import repository from '../repositories/benefit.repository.js';
import timesheetRepository from '../repositories/time-sheet.repository.js';

class TrackingService {
    async findEmployee() {
        return await repository.findEmployee();
    }

    async createEmployee(nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem) {

        if (!nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "nome", "funcao", "setor", "contrato", "centro_custo" são obrigatórios.', 400);
        }

        return await repository.createEmployee(nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);
    }

    async updateEmployee(id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem) {

        if (!id || !nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "id", "nome", "funcao", "setor", "contrato", "centro_custo" são obrigatórios.', 400);
        }

        return await repository.update(id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);
    }

    async deleteEmployee(id) {

        if (!id) {
            throw new AppError('O campo "id" é obrigatório.', 400);
        }

        return await repository.delete(id);
    }

    async findRecord(data, centro_custo) {
        if (!data) {
            throw new AppError('O campo data é obrigatório.', 400);
        }

        if (data.split('-')[1] < 1 || data.split('-')[1] > 12) {
            throw new AppError('Mês inválido.', 400);
        }

        const CurrentDate = new Date().getFullYear();

        if (data.split('-')[0] < 2025 || data.split('-')[0] > CurrentDate) {
            throw new AppError('Ano inválido.', 400);
        }

        const [year, month] = data.split('-');

        const date = `${year}-${month}-01`;

        const monthNumber = Number(month);

        let lastMonth = '';
        let monthBeforeLast = '';
        let lastYear = year;
        let yearBeforeLast = year;

        if (monthNumber === 1) {
            lastMonth = '12';
            lastYear = (Number(year) - 1).toString();

            monthBeforeLast = '11';
            yearBeforeLast = (Number(year) - 1).toString();
        } else if (monthNumber === 2) {
            lastMonth = '01';
            lastYear = year;

            monthBeforeLast = '12';
            yearBeforeLast = (Number(year) - 1).toString();
        } else {
            lastMonth = (monthNumber - 1).toString().padStart(2, '0');
            monthBeforeLast = (monthNumber - 2).toString().padStart(2, '0');
        }

        const firstMonth = `${yearBeforeLast}-${monthBeforeLast}-16`;
        const secondMonth = `${lastYear}-${lastMonth}-15`;

        const employees = await repository.findRecord(date, centro_custo);
        const timesheets = await timesheetRepository.findByMonth(firstMonth, secondMonth);

        const dataMerge = employees.map((employee) => {
            const timesheet = timesheets.filter((ts) => {
                return ts.nome.trim().toUpperCase() === employee.nome.trim().toUpperCase()
            });

            return { ...employee, timesheet }
        })

        return dataMerge.map((item) => {
            return {
                ...item,
                vc_vr_month: this.#calculateVcVrMonth(item),
                vr_caju_month: this.#calculateVrCajuMonth(item),
                vr_vr_month: this.#calculateVrVrMonth(item),
                vt_caju_month: this.#calculateVtCajuMonth(item),
                vt_vem_month: this.#calculateVtVemMonth(item),
                vc_day: this.#calculateVcDay(item),
                vr_day: this.#calculateVrDay(item),
                vt_day: this.#calculateVtDay(item),
                vc_month: this.#calculateVcMonth(item),
                vr_month: this.#calculateVrMonth(item),
                vt_month: this.#calculateVtMonth(item),
                vc_caju_month: this.#calculateVcCajuMonth(item),
                total: this.#calculateBenefits(item),
                days_worked: this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato),
                extra_days: this.#extraDaysCounter(item.timesheet),
                absences: this.#absenceCounter(item.timesheet),
                medical_certificates: this.#medicalCertificateCounter(item.timesheet)
            }
        })
    }

    async createRecord(ano_mes, dias_uteis, dias_nao_uteis) {

        if (!ano_mes || !dias_uteis || !dias_nao_uteis) {
            throw new AppError('Os campos "ano_mes" e "dias_uteis" são obrigatórios.', 400);
        }

        const [year, month] = ano_mes.split('-');
        const data = `${year}-${month}-01`;

        const record = await repository.findEmployee();
        const records = record.map(item => {
            const { id, ...rest } = item;
            return { ...rest, data, dias_uteis, dias_nao_uteis };
        })

        return await repository.createRecord(records);
    }

    async updateRecord(nome, data, dias_uteis, dias_nao_uteis) {

        if (!nome || !data || !dias_uteis || !dias_nao_uteis) {
            throw new AppError('Os campos "nome", "data", "dias_uteis" e "dias_nao_uteis" são obrigatórios.', 400);
        }

        const [year, month] = data.split('-');
        const fullData = `${year}-${month}-01`;
        return await repository.updateRecord(nome, fullData, dias_uteis, dias_nao_uteis);
    }

    #calculateVrCajuDay(item) {
        const vr = item.vr_caju;
        return vr > 50 ? vr / item.dias_uteis : vr;
    }

    #calculateVrVrDay(item) {
        const vr = item.vr_vr;
        return vr > 50 ? vr / item.dias_uteis : vr;
    }

    #calculateVrCajuMonth(item) {
        const vrDay = this.#calculateVrCajuDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vrDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vrDay * daysWorked).toFixed(2));
    }

    #calculateVrVrMonth(item) {
        const vrDay = this.#calculateVrVrDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vrDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vrDay * daysWorked).toFixed(2));
    }

    #calculateVtCajuDay(item) {
        const vtDay = item.vt_caju;
        return vtDay > 50 ? vtDay / item.dias_uteis : vtDay;
    }

    #calculateVtVemDay(item) {
        const vtDay = item.vt_vem;
        return vtDay > 50 ? vtDay / item.dias_uteis : vtDay;
    }

    #calculateVtCajuMonth(item) {
        const vrDay = this.#calculateVrCajuDay(item);
        const vtDay = this.#calculateVtCajuDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vtDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vtDay * daysWorked).toFixed(2));
    }

    #calculateVtVemMonth(item) {
        const vrDay = this.#calculateVrDay(item);
        const vtDay = this.#calculateVtVemDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vtDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vtDay * daysWorked).toFixed(2));
    }

    #calculateVcCajuDay(item) {
        const vcDay = item.vc_caju;
        return vcDay > 50 ? vcDay / item.dias_uteis : vcDay;
    }

    #calculateVcVrDay(item) {
        const vcDay = item.vc_vr;
        return vcDay > 50 ? vcDay / item.dias_uteis : vcDay;
    }

    #calculateVcCajuMonth(item) {
        const vcDay = this.#calculateVcCajuDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);
        return parseFloat((vcDay * daysWorked).toFixed(2));
    }

    #calculateVcVrMonth(item) {
        const vcDay = this.#calculateVcVrDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);
        return parseFloat((vcDay * daysWorked).toFixed(2));
    }

    #calculateVrDay(item) {
        const vr = item.vr_caju + item.vr_vr;
        return vr > 50 ? vr / item.dias_uteis : vr;
    }

    #calculateVrMonth(item) {
        const vrDay = this.#calculateVrDay(item);
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vrDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vrDay * daysWorked).toFixed(2));
    }

    #calculateVtDay(item) {
        const vtDay = item.vt_caju + item.vt_vem;
        return vtDay > 50 ? parseFloat((vtDay / item.dias_uteis).toFixed(2)) : vtDay;
    }

    #calculateVtMonth(item) {
        const vrDay = this.#calculateVrDay(item);
        const vtDay = this.#calculateVtDay(item);
        const vtFixed = item.vt_caju + item.vt_vem;
        const daysWorked = this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato);

        if (vtFixed > 50) {
            return vtFixed;
        } else if (vrDay > 25 && vrDay < 35) {
            return parseFloat((vtDay * (daysWorked + item.dias_nao_uteis)).toFixed(2));
        }
        return parseFloat((vtDay * daysWorked).toFixed(2));
    }

    #calculateVcDay(item) {
        const vcDay = item.vc_caju + item.vc_vr;
        return vcDay > 50 ? parseFloat((vcDay / item.dias_uteis).toFixed(2)) : vcDay;
    }

    #calculateVcMonth(item) {
        const vcDay = this.#calculateVcDay(item);
        return vcDay > 50 ? vcDay : parseFloat((vcDay * this.#daysWorked(item.dias_uteis, item.timesheet, item.contrato)).toFixed(2));
    }

    #calculateBenefits(item) {
        return parseFloat((this.#calculateVtMonth(item) + this.#calculateVrMonth(item) + this.#calculateVcMonth(item)).toFixed(2));
    }

    // ========== MÉTODOS AUXILIARES ========== //
    #daysWorked(businessDays, timesheet, contract) {
        if (contract === 'ESTÁGIO') {
            return businessDays - this.#medicalCertificateCounter(timesheet);
        }
        return businessDays + this.#extraDaysCounter(timesheet) - this.#absenceCounter(timesheet) - this.#medicalCertificateCounter(timesheet);
    }

    #extraDaysCounter(timesheet) {
        return timesheet.filter(value => value.evento_abono === 'Dia extra').length;
    }

    #absenceCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'NÃO CONSTA' &&
            parseInt(value.jornada_realizada?.split(':')[0]) <= 3
        ).length;
    }

    #medicalCertificateCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'Atestado Médico' &&
            !this.#isWeekend(value.periodo)
        ).length;
    }

    #isWeekend(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    }
}

export default new TrackingService();
