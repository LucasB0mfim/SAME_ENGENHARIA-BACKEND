import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        try {
            logger.info('Solicitação para retornar a tabela de experiência.');

            if (!pool.connected) {
                await pool.connect();
            }

            const request = pool.request();
            const result = await request.query('exec experience');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Erro ao retornar a tabela de experiência');
                throw new AppError('Erro ao retornar a tabela de experiência', 404);
            }

            logger.info('Tabela de experiência encontrada.');

            // Mapeia os dados e remove duplicatas com base em 'funcionario' (chave primária)
            const updateExp = Array.from(
                new Map(
                    result.recordset.map(data => [
                        data.funcionario, // Usa 'funcionario' como chave única
                        {
                            status: data.status,
                            estado: data.estado,
                            centro_custo: data.centro_custo,
                            funcao: data.funcao,
                            chapa: data.chapa,
                            funcionario: data.funcionario,
                            admissao: data.admissao,
                            primeiro_periodo: data.primeiro_periodo,
                            segundo_periodo: data.segundo_periodo,
                            viajar: data.viajar,
                            segmento: data.segmento
                        }
                    ])
                ).values()
            );

            logger.info('Atualizando banco de dados auxiliar.');

            const { data, error } = await dataBase
                .from('experience')
                .upsert(updateExp, { onConflict: 'funcionario' })
                .select('*');

            if (!data || error) {
                logger.error('Não foi possível transferir os dados para o Supabase', { error });
                throw new AppError(`Não foi possível transferir os dados para o Supabase: ${error.message}`);
            }

            logger.info('Dados transferidos com sucesso.');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar todos os registros:', error);
            throw error;
        }
    }
}

export default new ExperienceRepository();