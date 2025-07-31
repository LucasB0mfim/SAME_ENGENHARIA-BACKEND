import { addDays } from 'date-fns';

import repository from '../repositories/resignation.repository.js';
import AppError from '../utils/errors/AppError.js';

class ResignationService {

    async findAll() {
        return await repository.findAll();
    }

    async findByStatus(status) {
        if (!status) throw new AppError('O campo "status" é obrigatório.', 400);
        return await repository.findByStatus(status);
    }

    async create(nome, funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao) {
        return await repository.create(nome.toUpperCase(), funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao.toUpperCase());
    }

    async update(id, nome, funcao, centro_custo, status, modalidade, colaborador_comunicado, data_inicio_aviso_trabalhado, data_rescisao) {

        if (!id || !data_inicio_aviso_trabalhado) {
            throw new AppError('Os "id" e "data_inicio_aviso_trabalhado" são obrigatórios.', 400);
        }

        const dataDemissao = addDays(new Date(data_inicio_aviso_trabalhado), 29);
        const dataUltimoDiaTrabalhado = addDays(new Date(data_inicio_aviso_trabalhado), 22);
        const dataPagamentoRescisao = addDays(dataDemissao, 7);

        return await repository.update(id, nome, funcao, centro_custo, status, modalidade, colaborador_comunicado, data_inicio_aviso_trabalhado, data_rescisao, dataDemissao, dataUltimoDiaTrabalhado, dataPagamentoRescisao);
    }

    async delete(id) {
        if (!id) throw new AppError('O cmapo de "id" é obrigatório.');
        return await repository.delete(id);
    }
}

export default new ResignationService();