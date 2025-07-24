import repository from '../repositories/resignation.repository.js';
import AppError from '../utils/errors/AppError.js';

class ResignationService {

    async findAll() {
        return await repository.findAll();
    }

    async create(centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status) {

        if (!nome || !funcao || !status || !centro_custo) {
            throw new AppError('Os campos "nome", "funcao", "status" e "centro_custo" são obrigatórios.', 400);
        }

        const toUpperCase = {
            centro_custo: centro_custo?.trim().toUpperCase() || null,
            colaborador_comunicado: colaborador_comunicado?.trim().toUpperCase() || null,
            data_demissao: data_demissao || null,
            data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado || null,
            data_pagamento_rescisao: data_pagamento_rescisao || null,
            data_rescisao: data_rescisao || null,
            data_solicitacao: data_solicitacao || null,
            data_ultimo_dia_trabalhado: data_ultimo_dia_trabalhado || null,
            funcao: funcao?.trim().toUpperCase() || null,
            modalidade: modalidade?.trim().toUpperCase() || null,
            nome: nome?.trim().toUpperCase() || null,
            observacao: observacao?.trim().toUpperCase() || null,
            status: status?.trim().toUpperCase() || null
        }

        return await repository.create(
            toUpperCase.centro_custo,
            toUpperCase.colaborador_comunicado,
            toUpperCase.data_demissao,
            toUpperCase.data_inicio_aviso_trabalhado,
            toUpperCase.data_pagamento_rescisao,
            toUpperCase.data_rescisao,
            toUpperCase.data_solicitacao,
            toUpperCase.data_ultimo_dia_trabalhado,
            toUpperCase.funcao,
            toUpperCase.modalidade,
            toUpperCase.nome,
            toUpperCase.observacao,
            toUpperCase.status
        );
    }

    async update(id, centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status) {

        if (!id || !centro_custo || !colaborador_comunicado || !data_demissao || !data_inicio_aviso_trabalhado || !data_pagamento_rescisao || !data_rescisao || !data_solicitacao || !data_ultimo_dia_trabalhado || !funcao || !modalidade || !nome || !status) {
            throw new AppError('Todos os campos são obrigatórios.', 400);
        }

        const toUpperCase = {
            id: id,
            centro_custo: centro_custo?.trim().toUpperCase() || '',
            colaborador_comunicado: colaborador_comunicado?.trim().toUpperCase() || 'NÃO',
            data_demissao: data_demissao || null,
            data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado || null,
            data_pagamento_rescisao: data_pagamento_rescisao || null,
            data_rescisao: data_rescisao || null,
            data_solicitacao: data_solicitacao || null,
            data_ultimo_dia_trabalhado: data_ultimo_dia_trabalhado || null,
            funcao: funcao?.trim().toUpperCase() || '',
            modalidade: modalidade?.trim().toUpperCase() || '',
            nome: nome?.trim().toUpperCase() || '',
            observacao: observacao?.trim().toUpperCase() || '',
            status: status?.trim().toUpperCase() || 'NOVA SOLICITAÇÃO'
        }

        return await repository.update(
            toUpperCase.id,
            toUpperCase.centro_custo,
            toUpperCase.colaborador_comunicado,
            toUpperCase.data_demissao,
            toUpperCase.data_inicio_aviso_trabalhado,
            toUpperCase.data_pagamento_rescisao,
            toUpperCase.data_rescisao,
            toUpperCase.data_solicitacao,
            toUpperCase.data_ultimo_dia_trabalhado,
            toUpperCase.funcao,
            toUpperCase.modalidade,
            toUpperCase.nome,
            toUpperCase.observacao,
            toUpperCase.status
        );
    }
}

export default new ResignationService();