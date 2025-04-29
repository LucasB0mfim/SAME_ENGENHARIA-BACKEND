import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class IndicatorRepository {
    async findCostCenter() {
        let connection;
        try {
            connection = await pool.connect();

            const result = await connection.request().query('exec financial');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Nenhum dado encontrado na tabela.');
                throw new AppError('Nenhum dado encontrado na tabela.', 404);
            }

            logger.info(`${result.recordset.length} registros encontrados.`);

            return result.recordset;
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

export default new IndicatorRepository();