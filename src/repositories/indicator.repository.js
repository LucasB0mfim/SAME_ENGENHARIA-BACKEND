import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class IndicatorRepository {
    async findCostCenter() {
        try {
            await pool.connect();

            const result = await pool.request().query('exec financial');

            const costCenter = result.recordset.map(item => ({
                nome_centro_custo: item.nome_centro_custo,
                total_receber: item.total_receber,
                total_pago_material: item.total_pago_material,
                material_pago: item.material_pago,
                material_apagar: item.material_apagar,
                total_pago_servico: item.total_pago_servico,
                servico_pago: item.servico_pago,
                servico_apagar: item.servico_apagar,
                folha_pagamento: item.folha_pagamento
            }));

            // ATUALIZA A TABELA
            const { error: upsertError } = await dataBase
                .from('financial')
                .upsert(costCenter, { onConflict: 'nome_centro_custo' });

            if (upsertError) {
                logger.error('Não foi possível atualizar a tabela: ', { error: upsertError });
                throw new AppError('Não foi possível atualizar a tabela: ', 404);
            }

            // BUSCA OS REGISTROS
            const { data, error } = await dataBase
                .from('financial')
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

export default new IndicatorRepository();