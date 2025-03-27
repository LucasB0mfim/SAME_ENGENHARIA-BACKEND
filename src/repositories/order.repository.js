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

    async update(status, quantidade_entregue, numero_oc, idprd, ultima_atualizacao, recebedor, nota_fiscal) {
        try {
            logger.info('Atualizando ordem de compra.');

            const { data: updatedOrder, error } = await dataBase
                .from('orders')
                .update({ status, quantidade_entregue, numero_oc, idprd, ultima_atualizacao, recebedor, nota_fiscal })
                .eq('numero_oc', numero_oc)
                .eq('idprd', idprd)
                .select('*');

            if (!updatedOrder || error) {
                logger.error('Não foi possível atualizar o pedido.', { error });
                throw new AppError('Não foi possível atualizar o pedido.', 400);
            }

            logger.info('Pedido atualizado com sucesso.', { updatedOrder });
            return updatedOrder;
        } catch (error) {
            logger.error('Erro ao atualizar o pedido.', { error });
            throw error;
        }
    }
}

export default new OrderRepository();