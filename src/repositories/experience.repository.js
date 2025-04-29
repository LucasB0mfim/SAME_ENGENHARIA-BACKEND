import dataBase from '../database/dataBase.js';
import pool from '../database/sql-server.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class ExperienceRepository {
    async findAll() {
        try {
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