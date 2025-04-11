import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        try {
            await pool.connect();

            const result = await pool.request().query('exec experience');

            const newEmployee = result.recordset.map(item => ({
                status: item.status,
                estado: item.estado,
                centro_custo: item.centro_custo,
                funcao: item.funcao,
                chapa: item.chapa,
                funcionario: item.funcionario,
                admissao: item.admissao,
                primeiro_periodo: item.primeiro_periodo,
                segundo_periodo: item.segundo_periodo,
                viajar: item.viajar,
                segmento: item.segmento
            }));

            // ATUALIZA A TABELA
            const { error: upsertError } = await dataBase
                .from('experience')
                .upsert(newEmployee, { onConflict: 'funcionario', ignoreDuplicates: true });

            if (upsertError) {
                logger.error('Não foi possível atualizar a tabela: ', { error: upsertError });
                throw new AppError('Não foi possível atualizar a tabela: ', 404);
            }

            // BUSCA OS REGISTROS
            const { data, error } = await dataBase
                .from('experience')
                .select('*');

            if (!data || error) {
                logger.error('Não foi possível buscar os dados da tabela: ', { error });
                throw new AppError('Não foi possível buscar os dados da tabela: ', 404);
            }

            logger.info(`${data.length} registros encontrados.`);

            return data;
        } catch (error) {
            logger.error('Erro ao sincronizar dados.', { error });
            throw error;
        }
    }
}

export default new ExperienceRepository();