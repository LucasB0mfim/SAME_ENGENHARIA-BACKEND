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

    async create(nome, funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao) {
        try {

            const { data, error } = await dataBase
                .from('resignation')
                .insert({
                    nome: nome,
                    funcao: funcao,
                    centro_custo: centro_custo,
                    status: status,
                    modalidade: modalidade,
                    data_comunicacao: data_comunicacao,
                    data_solicitacao: data_solicitacao,
                    observacao: observacao
                });

            if (error) {
                logger.warn('Falha ao gerar a solicitação da demissão:', error);
                throw new AppError('Falha ao gerar a solicitação da demissão.', 400);
            }

            logger.info('Solicitação de demissão gerada com sucesso.');

            return data;
        } catch (error) {
            logger.error('Erro ao gerar registro de demissão:', error);
            throw new AppError('Não foi possível solicitar a demissão.', 500);
        }
    }

    async update(id, status, modalidade, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado) {
        try {
            const { data, error } = await dataBase
                .from('resignation')
                .update({
                    status: status,
                    modalidade: modalidade,
                    colaborador_comunicado: colaborador_comunicado,
                    data_demissao: data_demissao,
                    data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado,
                    data_pagamento_rescisao: data_pagamento_rescisao,
                    data_rescisao: data_rescisao,
                    data_solicitacao: data_solicitacao,
                    data_ultimo_dia_trabalhado: data_ultimo_dia_trabalhado
                })
                .eq('id', id)
                .select('id')

            if (!data || error) {
                logger.warn('Erro ao atualizar solicitação de demissão.');
                throw new AppError('Não foi possível atualizar a solicitação.', 400);
            }

            logger.info('Solicitação de demissão atualizado com sucesso.');

            return data;
        } catch (error) {
            logger.warn('Erro ao atualizar solicitação da tabela resignation.');
            throw new AppError('Não foi possível atualizar solicitação.', 400);
        }
    }

    async delete(id) {
        try {
            const { data, error } = await dataBase
                .from('resignation')
                .delete()
                .eq('id', id);

            if (error) {
                logger.warn('Não foi possível deletar registro na tabela resignation.');
                throw new AppError(`Não foi possível deletar os registros do id: ${id}`, 400);
            }

            logger.info(`Registros do id: ${id} deletados da tabela resignation com sucesso.`);

            return data;
        } catch (error) {
            logger.warn('Erro ao deletar registro da tabela resignation.');
            throw new AppError('Não foi possível deletar registro.', 400);
        }
    }
}

export default new ResignationRepository();