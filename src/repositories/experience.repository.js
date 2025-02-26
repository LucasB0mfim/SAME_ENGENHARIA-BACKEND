import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        try {
            logger.info('Buscando tabela.')

            const { data: records, error } = await dataBase.from('experience').select('*')

            if (!records || error) {
                logger.error('Não foi possível buscar tabela.');
                throw new AppError('Não foi possível buscar tabela');
            }

            logger.info('Tabela encontrada.')

            return records;
        } catch (error) {
            logger.error('Erro ao buscar tabela.');
            throw new AppError('Erro ao buscar tabela.')
        }
    }
}

export default new ExperienceRepository();