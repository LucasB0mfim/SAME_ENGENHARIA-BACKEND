import logger from '../utils/logger/winston.js';

import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';

class ResignationRepository {

    async findAll() {
        try {
            const { data, error } = await dataBase
                .from('resignation')
                .select('*');

            if (error) {
                logger.warn('Falha ao consultar tabela resignation.');
                throw new AppError('Não foi possível realizar a busca.', 400);
            }

            logger.info('Consulta na tabela resignation realizada com sucesso.');

            return data;
        } catch (error) {
            logger.error('Erro no funcionamento do método:', error);
            throw new AppError('Falha ao consultar tabela resignation.', 500);
        }
    }

    async create(centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status) {
        try {

            const { data, error } = await dataBase
                .from('resignation')
                .insert({
                    centro_custo: centro_custo,
                    colaborador_comunicado: colaborador_comunicado,
                    data_demissao: data_demissao,
                    data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado,
                    data_pagamento_rescisao: data_pagamento_rescisao,
                    data_rescisao: data_rescisao,
                    data_solicitacao: data_solicitacao,
                    data_ultimo_dia_trabalhado: data_ultimo_dia_trabalhado,
                    funcao: funcao,
                    modalidade: modalidade,
                    nome: nome,
                    observacao: observacao,
                    status: status
                })

            if (error) {
                logger.warn('Falha ao criar na tabela resignation.');
                throw new AppError('Não foi possível criar o registro.', 400);
            }

            logger.info('Criação na tabela resignation realizada com sucesso.');

            return data;
        } catch (error) {
            logger.error('Erro no funcionamento do método:', error);
            throw new AppError('Falha ao criar na tabela resignation.', 500);
        }
    }

    async update(id, centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status) {
        try {

            const { data, error } = await dataBase
                .from('resignation')
                .update({
                    centro_custo: centro_custo,
                    colaborador_comunicado: colaborador_comunicado,
                    data_demissao: data_demissao,
                    data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado,
                    data_pagamento_rescisao: data_pagamento_rescisao,
                    data_rescisao: data_rescisao,
                    data_solicitacao: data_solicitacao,
                    data_ultimo_dia_trabalhado: data_ultimo_dia_trabalhado,
                    funcao: funcao,
                    modalidade: modalidade,
                    nome: nome,
                    observacao: observacao,
                    status: status
                })
                .eq('id', id);

            if (error) {
                logger.warn('Falha ao atualizar tabela resignation.');
                throw new AppError('Não foi possível atualizar o registro.', 400);
            }

            logger.info('Atualização na tabela resignation realizada com sucesso.');

            return data;
        } catch (error) {
            logger.error('Erro no funcionamento do método:', error);
            throw new AppError('Falha ao atualizar tabela resignation.', 500);
        }
    }
}

export default new ResignationRepository();