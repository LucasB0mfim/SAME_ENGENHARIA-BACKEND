import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import pool from '../database/sql-server.js';

class OrderRepository {

    async findAll() {
        try {
            logger.info('Buscando todos os registros de pedidos.');

            if (!pool.connected) {
                await pool.connect();
            }

            const request = pool.request();

            const result = await request.query('exec orders');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Não foi possível encontrar os registros de pedidos.');
                throw new AppError('Não foi possível encontrar os registros de pedidos.', 404);
            }

            logger.info('Registros encontrados de pedidos.');

            // Mapear os dados do SQL Server
            const ordersToCheck = Array.from(
                new Map(
                    result.recordset.map(data => [
                        data.idprd, // Usa 'idprd' como chave única
                        {
                            idprd: data.idprd,
                            data_criacao_oc: data.data_criacao_oc,
                            numero_oc: data.numero_oc,
                            material: data.material,
                            quantidade: data.quantidade,
                            unidade: data.unidade,
                            valor_unitario: data.valor_unitario,
                            valor_total: data.valor_total,
                            fornecedor: data.fornecedor,
                            previsao_entrega: data.previsao_entrega,
                            centro_custo: data.centro_custo,
                            usuario_criacao: data.usuario_criacao,
                        }
                    ])
                ).values()
            );

            // Buscar todos os idprd existentes no Supabase
            const { data: existingOrders, error: fetchError } = await dataBase
                .from('orders')
                .select('idprd');

            if (fetchError) {
                logger.error('Erro ao buscar idprd existentes no Supabase', { fetchError });
                throw new AppError(`Erro ao verificar registros existentes: ${fetchError.message}`);
            }

            // Criar um Set com os idprd existentes
            const existingIds = new Set(existingOrders.map(order => order.idprd));

            // Filtrar apenas os pedidos cujo idprd NÃO existe no Supabase
            const ordersToInsert = ordersToCheck.filter(order => !existingIds.has(order.idprd));

            // Se houver novos registros, inseri-los no Supabase
            if (ordersToInsert.length > 0) {
                const { error: insertError } = await dataBase
                    .from('orders')
                    .insert(ordersToInsert);

                if (insertError) {
                    logger.error('Não foi possível transferir os dados para o Supabase', { insertError });
                    throw new AppError(`Não foi possível transferir os dados para o Supabase: ${insertError.message}`);
                }

                logger.info('Novos dados transferidos com sucesso.');
            } else {
                logger.info('Nenhum novo pedido para inserir no Supabase.');
            }

            // Buscar todos os dados do Supabase, independentemente de inserção
            const { data: allOrders, error: selectError } = await dataBase
                .from('orders')
                .select('*');

            if (selectError) {
                logger.error('Erro ao buscar todos os registros do Supabase', { selectError });
                throw new AppError(`Erro ao buscar registros do Supabase: ${selectError.message}`);
            }

            logger.info('Dados do Supabase retornados com sucesso.');

            return allOrders;
        } catch (error) {
            logger.error('Erro ao buscar os registros de pedidos.', { error });
            throw error;
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
                logger.error('Não foi possível atualizar o pedido', { error });
                throw new AppError('Não foi possível atualizar o pedido', 404);
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