import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';

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
        try {
            logger.info('Nota fiscal recebida');

            const { data, error } = await dataBase
                .from('orders')
                .update({nota_fiscal: nota_fiscal})
                .eq('idprd', idprd)
                .select('nota_fiscal')

                if (!data || error) {
                    logger.error('Não foi possível armazenar a nota fiscal.', { error });
                    throw new AppError('Não foi possível armazenar a nota fiscal.', 404);
                }

                logger.info('Nota fiscal armazenada.');

                return data;
        } catch (error) {
            logger.error('Erro ao armazenar a nota fiscal.');
            throw error;
        }
    }
}

export default new OrderRepository();