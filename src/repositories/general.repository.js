import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class NoticeRepository {
    async findNotice() {
        try {
            const { data, error } = await dataBase
                .from('notices')
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

    async findComment() {
        try {
            const { data, error } = await dataBase
                .from('comment')
                .select('*')
                .order('created_at', { ascending: false })

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

    async sendComment(avatar, username, comment) {
        try {
            const { data, error } = await dataBase
                .from('comment')
                .insert({
                    avatar: avatar,
                    username: username,
                    comment: comment
                })
                .select('*');

            if (!data || error) {
                logger.error('Não foi possível inserir os dados da tabela: ', { error });
                throw new AppError('Não foi possível inserir os dados da tabela: ', 404);
            }

            logger.info(`${data.length} registros encontrados.`);

            return data;
        } catch (error) {
            logger.error('Erro ao sincronizar dados.', { error });
            throw error;
        }
    }
}

export default new NoticeRepository();