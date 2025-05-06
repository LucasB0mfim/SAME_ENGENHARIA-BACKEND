import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class BenefitRepository {

    async findAll() {
        try {
            const { data, error } = await dataBase
            .from('perifericos')
            .select('*')

            if (error) {
                logger.error('Err ao consultar a tabela findAll (benefit).', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data
        } catch (error) {
            logger.error('Erro ao sincronizar pedidos.', { error });
            throw error;
        }
    }
}

export default new BenefitRepository();