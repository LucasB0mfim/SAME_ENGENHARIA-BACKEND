import repository from '../repositories/benefit.repository.js';
import timesheetRepository from '../repositories/time-sheet.repository.js';
import AppError from '../utils/errors/AppError.js';

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

    async findRecord(data) {
        if (!data) {
            throw new AppError('O campo data é obrigatório.', 400);
        }

        const [year, month] = data.split('-');

        const startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const finalDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

        const employees = await repository.findRecord(startDate);
        const timesheet = await timesheetRepository.findByMonth(startDate, finalDate);

        const records = employees.map(employee => {
            const mergeData = timesheet
                .filter(ts => ts.nome.trim() === employee.nome.trim())
                .map(timesheet => ({
                    periodo: timesheet.periodo,
                    chapa: timesheet.chapa,
                    nome: timesheet.nome,
                    jornada_realizada: timesheet.jornada_realizada,
                    falta: timesheet.falta,
                    evento_abono: timesheet.evento_abono,
                    id: timesheet.id,
                    centro_custo: timesheet.centro_custo
                }));

            return {
                id: employee.id,
                nome: employee.nome,
                setor: employee.setor,
                contrato: employee.contrato,
                vr_caju: employee.vr_caju,
                vt_caju: employee.vt_caju,
                vc_caju: employee.vc_caju,
                funcao: employee.funcao,
                centro_custo: employee.centro_custo,
                data: employee.data,
                dias_uteis: employee.dias_uteis,
                vr_vr: employee.vr_vr,
                vc_vr: employee.vc_vr,
                vt_vem: employee.vt_vem,
                dias_nao_uteis: employee.dias_nao_uteis,
                timesheet: mergeData
            };
        });

        return records;
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
}

export default new TrackingService();
