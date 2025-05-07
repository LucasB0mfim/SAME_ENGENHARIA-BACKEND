import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class BenefitRepository {

    async findModel() {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .select('*')

            if (error) {
                logger.error('Erro ao consultar a tabela beneficiary', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data
        } catch (error) {
            logger.error('Erro no método findModel: ', { error });
            throw error;
        }
    }

    async create(records) {
        try {
            const fullRecord = records.map(({ ...rest }) => rest);
    
            const { data, error } = await dataBase
                .from('beneficiaries')
                .upsert(fullRecord, { onConflict: ['nome', 'data'], ignoreDuplicates: true })
                .select('*');
    
            if (error) {
                logger.error('Erro ao gravar dados na tabela beneficiaries:', error)
                throw new AppError('Erro ao gravar: ' + error.message, 500);
            }
            
            return data;
        } catch (error) {
            logger.error('Erro no create:', error);
            throw error;
        }
    }
}

export default new BenefitRepository();