import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class IndicatorRepository {
    async findCostCenter() {
        await pool.connect();
        const result = await pool.request().query('exec financial');
        return result;
    }
}

export default new IndicatorRepository();