import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import pool from '../database/sql-server.js';

class OrderRepository {
    async findAll() {
        try {
            logger.info('Buscando todos os registros de pedidos.');

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('orders')
                    .select('*')
                    .range(currentPage * recordsPage, (currentPage + 1) * recordsPage - 1);

                if (!records || error) {
                    logger.error('Não foi possível encontrar os registros de pedidos.', { error });
                    throw new AppError('Não foi possível encontrar os registros de pedidos.', 404);
                }

                if (records.length > 0) {
                    allRecords = allRecords.concat(records);
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }

            logger.info(`${allRecords.length} registros encontrados de pedidos.`);

            return allRecords;
        } catch (error) {
            logger.error('Erro ao buscar os registros de pedidos.');
            throw error;
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