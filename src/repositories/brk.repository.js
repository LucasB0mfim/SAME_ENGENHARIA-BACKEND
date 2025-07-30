import dataBase from '../database/dataBase.js';
import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

class BrkRepository {

    async findAll() {
        try {
            const { data, error } = await dataBase
                .from('brk')
                .select('*');

            if (!data || error) {
                logger.error('Erro ao consultar a tabela admission:', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no método findByStatus:', error);
            throw error;
        }
    }

    async findByStatus(status) {
        const { data, error } = await dataBase
            .from('brk')
            .select('*')
            .eq('status', status);

        if (!data) {
            throw new AppError('Nenhum registro foi encontrado.', 404);
        }

        if (error) {
            logger.warn('Erro ao buscar registros da tabela brk.');
            throw new AppError('Erro ao realizar a consulta.', 400);
        }

        return data;
    }

    async update(id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        const { data, error } = await dataBase
            .from('brk')
            .update({
                nome: nome,
                funcao: funcao,
                protocolo: protocolo || null,
                contrato: contrato || null,
                centro_custo: centro_custo,
                status: status,
                dt_envio_pesq_social: dt_envio_pesq_social || null,
                dt_prev_aprov_pesq_social: dt_prev_aprov_pesq_social || null,
                treinamento: treinamento,
                ficha_epi: ficha_epi,
                dt_envio_doc: dt_envio_doc || null,
                dt_prev_aprov_doc: dt_prev_aprov_doc || null,
                os: os,
                aso: aso,
                dt_reenvio_doc: dt_reenvio_doc || null,
                dt_prev_aprov_reenvio_doc: dt_prev_aprov_reenvio_doc || null
            })
            .eq('id', id)
            .select();

        if (!data || data.length === 0) {
            throw new AppError('Nenhum registro foi encontrado.', 404);
        }

        if (error) {
            console.log('Erro do Supabase:', JSON.stringify(error, null, 2));
            logger.warn(`Erro ao atualizar id: ${id} na tabela 'brk': ${JSON.stringify(error)}`);
            throw new AppError(`Erro ao atualizar colaborador: ${error.message}`, 400);
        }

        logger.info(`Dados do id: ${id} atualizados com sucesso na tabela 'brk'.`);
        return data;
    }

    async create(nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        const { data, error } = await dataBase
            .from('brk')
            .insert({
                nome: nome || null,
                funcao: funcao || null,
                protocolo: protocolo || null,
                contrato: contrato || null,
                centro_custo: centro_custo || null,
                status: status || null,
                dt_envio_pesq_social: dt_envio_pesq_social || null,
                dt_prev_aprov_pesq_social: dt_prev_aprov_pesq_social || null,
                treinamento: treinamento || null,
                ficha_epi: ficha_epi || null,
                dt_envio_doc: dt_envio_doc || null,
                dt_prev_aprov_doc: dt_prev_aprov_doc || null,
                os: os || null,
                aso: aso || null,
                dt_reenvio_doc: dt_reenvio_doc || null,
                dt_prev_aprov_reenvio_doc: dt_prev_aprov_reenvio_doc || null
            })
            .select();

        if (!data || data.length === 0) {
            throw new AppError('Nenhum registro foi encontrado.', 404);
        }

        if (error) {
            console.log('Erro do Supabase:', JSON.stringify(error, null, 2));
            logger.warn(`Erro ao criae registro na tabela 'brk': ${JSON.stringify(error)}`);
            throw new AppError(`Erro ao criar colaborador: ${error.message}`, 400);
        }

        logger.info(`Registro criado com sucesso na tabela 'brk'.`);
        return data;
    }
}

export default new BrkRepository();