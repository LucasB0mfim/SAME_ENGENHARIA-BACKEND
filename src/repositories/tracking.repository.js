import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class TrackingRepository {
    async findAll() {
        let connection;
        try {
            logger.info('Buscando registros de pedidos.');

            connection = await pool.connect();
            const result = await connection.request().query('exec tracking');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Nenhum dado encontrado na tabela.');
                throw new AppError('Nenhum dado encontrado na tabela.', 404);
            }

            logger.info(`${result.recordset.length} registros encontrados.`);

            const orderedResult = result.recordset.sort((a, b) => b.id - a.id);

            return orderedResult;
        } catch (error) {
            logger.error('Erro ao sincronizar pedidos.', { error });
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

export default new TrackingRepository();