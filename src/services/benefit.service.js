import repository from '../repositories/benefit.repository.js';
import AppError from '../utils/errors/AppError.js';

class TrackingService {
    async findEmployee() {
        return await repository.findEmployee();
    }

    async createEmployee(nome, funcao, setor, contrato, centro_custo, vr, vt, vc, vem) {
        
        if (!nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "nome", "funcao", "setor", "contrato", "centro_custo", "vr", "vt", "vc", "vem" são obrigatórios.', 400);
        }
        
        return await repository.createEmployee(nome, funcao, setor, contrato, centro_custo, vr, vt, vc, vem);
    }

    async updateEmployee(id, nome, funcao, setor, contrato, centro_custo, vr, vt, vc, vem) {
        
        if (!id || !nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "id", "nome", "funcao", "setor", "contrato", "centro_custo", "vr", "vt", "vc", "vem" são obrigatórios.', 400);
        }
        
        return await repository.update(id, nome, funcao, setor, contrato, centro_custo, vr, vt, vc, vem);
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

        const [ year, month ] = data.split('-');
        const correctDate = `${year}-${month}-01`;

        return await repository.findRecord(correctDate);
    }

    async createRecord(ano_mes, dias_uteis) {

        if (!ano_mes || !dias_uteis) {
            throw new AppError('Os campos "ano_mes" e "dias_uteis" são obrigatórios.', 400);
        }

        const [ year, month ] = ano_mes.split('-');
        const data = `${year}-${month}-01`;

        const record = await repository.findEmployee();
        const records = record.map(item => {
            const { id, ...rest } = item;
            return { ...rest, data, dias_uteis };
        })

        return await repository.createRecord(records);
    }    
}

export default new TrackingService();
