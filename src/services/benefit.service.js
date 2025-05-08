import repository from '../repositories/benefit.repository.js';
import AppError from '../utils/errors/AppError.js';

class TrackingService {
    async getEmployees() {
        return await repository.findModel();
    }

    async createRecord(data, dias_uteis) {
        if (!data || !dias_uteis) {
            throw new AppError('Os campos data e dias_uteis são obrigatórios.', 400);
        }
        const modelData = await repository.findModel();
        const fullRecord = modelData.map(record => {
            const { id, ...rest } = record;
            return { ...rest, data, dias_uteis };
        });
        return await repository.createRecord(fullRecord);
    }

    async createEmployee(nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem) {
        if (!nome || !posicao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "nome", "posicao", "setor", "contrato", "centro_custo", "vr", "vt", "vc", "vem" são obrigatórios.', 400);
        }
        return await repository.createEmployee(nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem);
    }
}

export default new TrackingService();
