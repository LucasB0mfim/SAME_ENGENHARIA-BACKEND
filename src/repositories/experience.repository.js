import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        let connection;
        try {
            connection = await pool.connect();
            const result = await connection.request().query('exec experience');
            const data = result.recordset;

            if (!data || data.length === 0) {
                logger.error('Nenhum dado encontrado na tabela experience do SQL Server.');
                throw new AppError('Nenhum dado encontrado na tabela experience do SQL Server.', 404);
            }

            return data;
        } catch (error) {
            logger.error('Erro ao sincronizar dados.', { error });
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

export default new ExperienceRepository();