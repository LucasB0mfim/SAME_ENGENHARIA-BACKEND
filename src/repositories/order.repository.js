import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import pool from '../database/sql-server.js';

class OrderRepository {
    async findAll() {
        let connection;
        try {
            logger.info('Buscando todos os registros de pedidos.');

            // Obter conexão do pool
            connection = await pool.connect();

            // Criar a query de seleção
            const query = `exec orders`;

            // Executar a query
            const result = await connection.request().query(query);
            const records = result.recordset;

            if (!records) {
                logger.error('Não foi possível encontrar os registros de pedidos.');
                throw new AppError('Não foi possível encontrar os registros de pedidos.', 404);
            }

            logger.info(`${records.length} registros encontrados de pedidos.`);

            return records;
        } catch (error) {
            logger.error('Erro ao buscar os registros de pedidos.', { error });
            throw error;
        } finally {
            // Liberar a conexão de volta para o pool
            if (connection) {
                connection.release();
            }
        }
    }

    async update(idprd, nota_fiscal) {
        let connection;
        try {
            logger.info('Nota fiscal recebida');

            // Obter conexão do pool
            connection = await pool.connect();

            // Criar a query de atualização
            const query = `
                UPDATE orders 
                SET nota_fiscal = @nota_fiscal 
                WHERE idprd = @idprd;
                
                SELECT nota_fiscal 
                FROM orders 
                WHERE idprd = @idprd;
            `;

            // Executar a query com parâmetros
            const result = await connection.request()
                .input('nota_fiscal', sql.NVarChar, nota_fiscal)
                .input('idprd', sql.Int, idprd)
                .query(query);

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Não foi possível armazenar a nota fiscal.');
                throw new AppError('Não foi possível armazenar a nota fiscal.', 404);
            }

            logger.info('Nota fiscal armazenada.');

            return result.recordset[0];
        } catch (error) {
            logger.error('Erro ao armazenar a nota fiscal.', { error });
            throw error;
        } finally {
            // Liberar a conexão de volta para o pool
            if (connection) {
                connection.release();
            }
        }
    }
}

export default new OrderRepository();