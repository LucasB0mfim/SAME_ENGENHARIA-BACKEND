import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class TrackingRepository {
    async findAll() {
        try {
            logger.info('Solicitação para retornar a tabela de tracking.');

            if (!pool.connected) {
                await pool.connect();
            }

            const request = pool.request();
            const result = await request.query('exec tracking');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Erro ao retornar a tabela de tracking');
                throw new AppError('Erro ao retornar a tabela de tracking', 404);
            }

            logger.info('Tabela de tracking encontrada.');

            const updatetrk = Array.from(
                new Map(
                    result.recordset.map(data => [
                        data.id, // Usa 'id' como chave única
                        {
                            cotacao: data.cotacao,
                            integracao: data.integracao,
                            centro_custo: data.centro_custo,
                            movimento: data.movimento,
                            id: data.id,
                            elaboracao_pedido: data.elaboracao_pedido,
                            aprovacao_id: data.aprovacao_id,
                            numero_oc: data.numero_oc,
                            elaboracao_oc: data.elaboracao_oc,
                            aprovacao_oc: data.aprovacao_oc,
                            data_entrega: data.data_entrega,
                            fornecedor: data.fornecedor,
                            material: data.material,
                            quantidade_total: data.quantidade_total,
                            unidade: data.unidade,
                            status: data.status,
                            criacao: data.criacao
                        }
                    ])
                ).values()
            );

            logger.info('Atualizando banco de dados auxiliar.');

            const { data, error } = await dataBase
                .from('tracking')
                .upsert(updatetrk, { onConflict: 'id' })
                .select('*');

            if (!data || error) {
                logger.error('Não foi possível transferir os dados para o Supabase', { error });
                throw new AppError(`Não foi possível transferir os dados para o Supabase: ${error.message}`);
            }

            logger.info('Dados transferidos com sucesso.');
            return data;
        } catch (error) {
            console.error('Erro ao buscar todos os registros:', error);
            throw error;
        }
    }
}

export default new TrackingRepository();