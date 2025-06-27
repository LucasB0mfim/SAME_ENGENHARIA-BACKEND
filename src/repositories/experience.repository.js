import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        let connection;
        try {
            connection = await pool.connect();
            const result = await connection.request().query('exec experience');
            const sqlData = result.recordset;

            if (!sqlData || sqlData.length === 0) {
                logger.error('Nenhum dado encontrado na tabela experience do SQL Server.');
                throw new AppError('Nenhum dado encontrado na tabela experience do SQL Server.', 404);
            }

            const { data: supabaseData, error: selectError } = await dataBase
                .from('experience')
                .select('*');

            if (selectError) {
                logger.error('Erro ao consultar tabela experience no Supabase.', { error: selectError });
                throw new AppError('Não foi possível consultar tabela experience no Supabase.', 404);
            }

            const sqlMap = new Map();
            sqlData.forEach(item => {
                const key = item.chapa || item.funcionario;
                sqlMap.set(key, item);
            });

            const supabaseMap = new Map();
            supabaseData?.forEach(item => {
                const key = item.chapa || item.funcionario;
                supabaseMap.set(key, item);
            });

            const operations = [];

            for (const [key] of supabaseMap) {
                if (!sqlMap.has(key)) {
                    operations.push(
                        dataBase.from('experience')
                            .delete()
                            .eq('chapa', key)
                            .then()
                    );
                }
            }

            for (const [key, sqlItem] of sqlMap) {
                const supabaseItem = supabaseMap.get(key);

                if (!supabaseItem || JSON.stringify(supabaseItem) !== JSON.stringify(sqlItem)) {
                    operations.push(
                        dataBase.from('experience')
                            .upsert(sqlItem)
                            .then()
                    );
                }
            }

            await Promise.all(operations);

            const { data: finalData, error: finalError } = await dataBase
                .from('experience')
                .select('*');

            if (finalError) {
                logger.error('Erro ao consultar tabela experience após sincronização.', { error: finalError });
                throw new AppError('Não foi possível consultar tabela experience após sincronização.', 404);
            }

            return finalData;
        } catch (error) {
            logger.error('Erro ao sincronizar dados.', { error });
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    async update(chapa, viajar, segmento) {
        try {
            const { data, error } = await dataBase
                .from('experience')
                .update({
                    viajar: viajar,
                    segmento: segmento
                })
                .eq('chapa', chapa)
                .select('*')

            if (!data || error) {
                logger.error('Erro ao atualizar modalidade de trabalho.', { error });
                throw new AppError(`Não foi possível atualizar o colaborador: ${chapa}.`, 404);
            }

            logger.info(`Modalidade do colaborador: ${chapa} atualizada.`);

            return data;
        } catch (error) {
            logger.error('Erro ao atualizar colaborador.', { error });
            throw error;
        }
    }
}

export default new ExperienceRepository();