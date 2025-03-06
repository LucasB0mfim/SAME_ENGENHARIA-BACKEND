import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';

class TimeSheetsRepository {
    async findAll() {
        try {
            logger.info('Buscando todos os registros da folha de ponto.');

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('folha_ponto')
                    .select('*')
                    .order('PERIODO', { ascending: true })
                    .range(currentPage * recordsPage, (currentPage + 1) * recordsPage - 1);

                if (!records || error) {
                    logger.error('Não foi possível encontrar os registros da folha de ponto.', { error });
                    throw new AppError('Não foi possível encontrar os registros da folha de ponto.', 404);
                }

                if (records.length > 0) {
                    allRecords = allRecords.concat(records);
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }

            logger.info(`${allRecords.length} registros encontrados na folha de ponto.`);

            return allRecords;
        } catch (error) {
            logger.error('Erro ao buscar os registros da folha de ponto.');
            throw error;
        }
    }

    async findByName(name) {
        try {
            logger.info(`Buscando registros do colaborador: '${name}' na folha de ponto.`);

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('folha_ponto')
                    .select('*')
                    .ilike('NOME', name)
                    .order('PERIODO', { ascending: true })
                    .range(currentPage * recordsPage, (currentPage + 1) * recordsPage - 1);

                if (!records || error) {
                    logger.error(`Não foi possível encontrar os registros de ponto do colaborador ${name}`, { error });
                    throw new AppError(`Não foi possível encontrar os registros de ponto do colaborador ${name}`, 404);
                }

                if (records.length > 0) {
                    allRecords = allRecords.concat(records);
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }

            logger.info(`${allRecords.length} registros encontrados do colaborador: ${name}.`);

            return allRecords;
        } catch (error) {
            logger.error(`Erro ao buscar os registros do colaborador: '${name}' na folha de ponto.`);
            throw error;
        }
    }

    async findByPeriod(periodo) {
        try {
            logger.info(`Buscando registros do período: ${periodo} na folha de ponto.`);

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('folha_ponto')
                    .select('*')
                    .eq('PERIODO', periodo)
                    .order('PERIODO', { ascending: true })
                    .range(currentPage * recordsPage, (currentPage + 1) * recordsPage - 1);

                if (!records || error) {
                    logger.error(`Não foi possivel buscar os registros do período: ${periodo}`);
                    throw new AppError(`Não foi possivel buscar os registros do período: ${periodo}.`, 404);
                }

                if (records.length > 0) {
                    allRecords = allRecords.concat(records);
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }

            logger.info(`${allRecords.length} registros encontrados do período: ${periodo} na folha de ponto.`);

            return allRecords;
        } catch (error) {
            logger.error(`Erro ao buscar registros do período: ${periodo} na folha de ponto.`);
            throw error;
        }
    }
}

export default new TimeSheetsRepository();