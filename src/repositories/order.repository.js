import pool from '../database/sql-server.js';
import dataBase from '../database/dataBase.js';

import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

class OrderRepository {

    async findAll() {
        let connection;
        try {
            connection = await pool.connect();
            const data = await connection.request().query('exec orders');

            if (data.recordset.length === 0) {
                logger.warn('Nenhum dado encontrado na tabela orders (SQL Server).');
                throw new AppError('Nenhum dado encontrado.', 404);
            }

            return data.recordset;
        } catch (error) {
            logger.error('Erro no método findAll (order): ', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async synchronize(data) {
        try {
            const { data: updateRecord, error: updateError } = await dataBase
                .from('orders')
                .upsert(data, { onConflict: 'idprd', ignoreDuplicates: true })

            if (updateError) {
                logger.error('Erro ao atualizar a tabela orders (supabase).');
                throw new AppError('Erro na atualização.', 500);
            }

            const { data: record, error: recordError } = await dataBase
                .from('orders')
                .select('*')

            if (record.length === 0) {
                logger.warn('Nenhum dado encontrado na tabela orders (supabase).');
                throw new AppError('Nenhum dado encontrado.', 404);
            }

            if (recordError) {
                logger.error('Erro na consulta da tabela orders (supabase).');
                throw new AppError('Erro na consulta da tabela orders.', 500);
            }

            logger.info('Consulta realizada na tabela orders (supabase).');

            return record;
        } catch (error) {
            logger.error('Erro no método synchronize: ', error);
            throw error;
        }
    }

    async update(idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal) {
        try {
            logger.info('Recebida a solicitação para atualizar pedido.');

            const { data, error } = await dataBase
                .from('orders')
                .update({ idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal })
                .eq('idprd', idprd)
                .select('*')

            if (!data || error) {
                logger.error('Falha na atualização da tabela orders');
                throw new AppError('Falha na sincronização de pedidos com o banco de dados', 500);
            }

            logger.info('Nota fiscal armazenada.');

            return data;
        } catch (error) {
            logger.error('Erro ao atualizar o pedido');
            throw error;
        }
    }

    async status(idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue) {
        try {
            logger.info('Nota fiscal recebida');

            const { data, error } = await dataBase
                .from('orders')
                .update({ idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue })
                .eq('idprd', idprd)
                .select('*')

            if (!data || error) {
                logger.error('Não foi possível armazenar a nota fiscal.', { error });
                throw new AppError('Não foi possível armazenar a nota fiscal.', 404);
            }

            logger.info('Nota fiscal armazenada.');

            return data;
        } catch (error) {
            logger.error('Erro ao armazenar a nota fiscal.');
            throw error;
        }
    }
}

export default new OrderRepository();