import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class TrackingRepository {
    async findAll() {
        try {
            await pool.connect();

            const result = await pool.request().query('exec tracking');

            console.log(JSON.stringify(result.recordset, null, 2));


            const newOrder = result.recordset.map(item => ({
                cotacao: item.cotacao,
                integracao: item.integracao,
                centro_custo: item.centro_custo,
                movimento: item.movimento,
                id: item.id,
                idprd: item.idprd,
                elaboracao_pedido: item.elaboracao_pedido,
                aprovacao_id: item.aprovacao_id,
                numero_oc: item.numero_oc,
                elaboracao_oc: item.elaboracao_oc,
                aprovacao_oc: item.aprovacao_oc,
                data_entrega: item.data_entrega,
                fornecedor: item.fornecedor,
                material: item.material,
                quantidade_total: item.quantidade_total,
                unidade: item.unidade,
                status: item.status,
                criacao: item.criacao
            }));

            // ATUALIZA A TABELA
            const { error: upsertError } = await dataBase
                .from('tracking')
                .upsert(newOrder, { onConflict: 'idprd' });

            if (upsertError) {
                logger.error('Não foi possível atualizar a tabela: ', { error: upsertError });
                throw new AppError('Não foi possível atualizar a tabela: ', 404);
            }

            // BUSCA OS REGISTROS
            const { data, error } = await dataBase
                .from('tracking')
                .select('*');

            if (!data || error) {
                logger.error('Não foi possível buscar os dados da tabela: ', { error });
                throw new AppError('Não foi possível buscar os dados da tabela: ', 404);
            }

            logger.info(`${data.length} registros encontrados.`);

            return data;
        } catch (error) {
            logger.error('Erro ao sincronizar pedidos.', { error });
            throw error;
        }
    }
}

export default new TrackingRepository();