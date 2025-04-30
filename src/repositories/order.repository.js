import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import pool from '../database/sql-server.js';

class OrderRepository {

    async findAll() {
        let connection;
        try {
            logger.info('Buscando registros da tabela Orders no SqlServer...')

            connection = await pool.connect();
            const result = await connection.request().query('exec orders');

            if (!result.recordset) {
                logger.error('Nenhum dado encontrado na tabela.');
                throw new AppError('Nenhum dado encontrado na tabela.', 404);
            }

            logger.info(`${result.recordset.length} registros encontrados.`);

            return result.recordset;
        } catch (error) {
            logger.error('Não foi possível sincronizar dados: ', { error });
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async synchronize(data) {
        try {
            logger.info('Iniciando sincronização de dados...');

            const { data: records, error } = await dataBase
                .from('orders')
                .upsert(data, { onConflict: ['idprd'] })
                .select();

            if (error) {
                logger.error('Falha ao sincronizar dados: ', { error });
                throw new AppError('Falha ao sincronizar dados.', 404);
            }

            logger.info('Dados sincronizados com sucesso.');

            return records;
        } catch (error) {
            logger.error('Erro no método de sincronização de dados.', error);
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