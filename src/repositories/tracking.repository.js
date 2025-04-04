import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class TrackingRepository {
    async findAll() {
        try {
            logger.info('Solicitação para retornar a tabela de tracking.');

            if (!pool.connected) {
                await pool.connect();
            }

            const request = pool.request();
            const result = await request.query('exec tracking');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Erro ao retornar a tabela de tracking');
                throw new AppError('Erro ao retornar a tabela de tracking', 404);
            }
            
            logger.info(`Tabela de tracking encontrada. Total de registros: ${result.recordset.length}`);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar todos os registros:', error);
            throw error;
        }
    }
}

export default new TrackingRepository();