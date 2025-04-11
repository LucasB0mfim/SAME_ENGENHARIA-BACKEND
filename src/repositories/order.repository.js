import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import pool from '../database/sql-server.js';

class OrderRepository {

    async findAll() {
        try {
            await pool.connect();
            const result = await pool.request().query('exec orders').recordset;

            const newOrder = result.map(item => ({
                idprd: item.idprd,
                data_criacao_oc: item.data_criacao_oc,
                numero_oc: item.numero_oc,
                material: item.material,
                quantidade: item.quantidade,
                unidade: item.unidade,
                valor_unitario: item.valor_unitario,
                valor_total: item.valor_total,
                fornecedor: item.fornecedor,
                previsao_entrega: item.previsao_entrega,
                centro_custo: item.centro_custo,
                usuario_criacao: item.usuario_criacao,
            }));

            const { data, error } = await dataBase
                .from('orders')
                .upsert(newOrder, { onConflict: 'idprd', ignoreDuplicates: true })
                .select('*')

            if (!data || error) {
                logger.error('Não foi possível atualizar a tabela: ', { error });
                throw new AppError('Não foi possível atualizar a tabela: ', 404);
            }

            logger.info(`${data.length} registros encontrados.`)

            return data;
        } catch (error) {
            logger.error('Erro ao sincronizar pedidos.', { error });
            throw err;
        }
    }

    async update(idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal) {
        try {
            logger.info('Recebida a solicitação para atualizar pedido.');

            const { data, error } = await dataBase
                .from('orders')
                .update({ idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal })
                .eq('idprd', idprd)
                .select('*')

            if (!data || error) {
                logger.error('Falha na atualização da tabela orders');
                throw new AppError('Falha na sincronização de pedidos com o banco de dados', 500);
            }

            logger.info('Nota fiscal armazenada.');

            return data;
        } catch (error) {
            logger.error('Erro ao atualizar o pedido');
            throw error;
        }
    }

    async status(idprd, status, data_entrega, registrado, quantidade, quantidade_entregue) {
        try {
            logger.info('Nota fiscal recebida');

            const { data, error } = await dataBase
                .from('orders')
                .update({ idprd, status, data_entrega, registrado, quantidade, quantidade_entregue })
                .eq('idprd', idprd)
                .select('*')

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