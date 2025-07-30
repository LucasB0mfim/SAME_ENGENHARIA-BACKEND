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

    async update(id, status, modalidade, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado) {
        if (!id) throw new AppError('O "id" é obrigatório para a atualização.', 400);
        return await repository.update(id, status, modalidade, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado);
    }

    async delete(id) {
        if (!id) throw new AppError('O cmapo de "id" é obrigatório.');
        return await repository.delete(id);
    }
}

export default new ResignationService();