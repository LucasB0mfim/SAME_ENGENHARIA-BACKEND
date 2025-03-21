import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';

class TrackingRequest {
    async findAll() {
        try {
            logger.info('Buscando todos os registros de pedidos.');

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('oc')
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
}

export default new TrackingRequest();