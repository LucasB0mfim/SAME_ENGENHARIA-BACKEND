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

    async findByStatus(status) {
        const { data, error } = await dataBase
            .from('resignation')
            .select('*')
            .eq('status', status);

        if (error) {
            logger.warn(`Erro ao atualizar id: ${id} na tabela 'brk': ${JSON.stringify(error)}`);
            throw new AppError(`Erro ao consultar registros: ${error.message}`, 400);
        }

        logger.info('Consulta na tabela "brk" realizada com sucesso!');

        return data;
    }

    async create(nome, cpf, funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao) {
        const { data, error } = await dataBase
            .from('resignation')
            .insert({
                nome: nome,
                cpf: cpf,
                funcao: funcao,
                centro_custo: centro_custo,
                status: status,
                modalidade: modalidade,
                data_comunicacao: data_comunicacao,
                data_solicitacao: data_solicitacao,
                observacao: observacao
            })
            .select();

        if (error) {
            logger.warn('Falha ao gerar a solicitação da demissão:', error);
            throw new AppError('Falha ao gerar a solicitação da demissão.', 400);
        }

        logger.info('Solicitação de demissão gerada com sucesso.');

        return data;
    }

    async update(id, nome, status, modalidade, colaborador_comunicado, data_inicio_aviso_trabalhado, data_rescisao, dataDemissao, dataUltimoDiaTrabalhado, dataPagamentoRescisao) {
        try {
            const { data, error } = await dataBase
                .from('resignation')
                .update({
                    nome: nome,
                    status: status,
                    modalidade: modalidade,
                    colaborador_comunicado: colaborador_comunicado,
                    data_inicio_aviso_trabalhado: data_inicio_aviso_trabalhado || null,
                    data_rescisao: data_rescisao || null,
                    data_demissao: dataDemissao || null,
                    data_ultimo_dia_trabalhado: dataUltimoDiaTrabalhado || null,
                    data_pagamento_rescisao: dataPagamentoRescisao || null
                })
                .eq('id', id)
                .select()

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