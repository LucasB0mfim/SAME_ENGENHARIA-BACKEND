import logger from '../utils/logger/winston.js';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';

class TimeSheetsRepository {
    async findAll() {
        try {
            logger.info('Buscando todos os registros da folha de ponto.');

            const { data: records, error } = await dataBase
                .from('timesheet')
                .select('*')
                .order('periodo', { ascending: true })

            if (!records || error) {
                logger.error('Não foi possível encontrar os registros da folha de ponto.', { error });
                throw new AppError('Não foi possível encontrar os registros da folha de ponto.', 404);
            }


            logger.info(`${records.length} registros encontrados na folha de ponto.`);

            return records;
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
                    .from('timesheet')
                    .select('*')
                    .ilike('nome', name)
                    .order('periodo', { ascending: true })
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

    async findByFilters(status, startDate, endDate) {
        try {
            const getCurrentDate = () => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            let finalStartDate = startDate;
            let finalEndDate = endDate;
            let finalStatus = status;

            if (!startDate && !endDate) {
                finalStartDate = '2025-01-15';
                finalEndDate = getCurrentDate();
            } else if (startDate && !endDate) {
                finalEndDate = getCurrentDate();
            } else if (!startDate && endDate) {
                finalStartDate = new Date();
            }

            logger.info(`Buscando registros na folha de ponto com filtros: status='${status}', startDate='${finalStartDate}', endDate='${finalEndDate}'`);

            let query = dataBase
                .from('timesheet')
                .select('*');

            // Filtros específicos para cada status
            if (status === 'Injustificado') {
                query = query
                    .eq('falta', 'SIM')
                    .eq('evento_abono', 'NÃO CONSTA');
            } else if (status === 'Justificado') {
                query = query
                    .eq('falta', 'SIM')
                    .neq('evento_abono', 'NÃO CONSTA');
            } else if (status === 'Geral') {
                query = query
            } else if (finalStatus) {
                query = query.eq('evento_abono', finalStatus);
            }

            // Filtros de data
            if (finalStartDate && finalEndDate) {
                query = query
                    .gte('periodo', finalStartDate)
                    .lte('periodo', finalEndDate);
            }

            const { data, error } = await query.order('periodo', { ascending: true });

            if (!data || error) {
                logger.error('Não foi possível buscar os registros na folha de ponto.', { error });
                throw new AppError('Não foi possível buscar os registros na folha de ponto.', 404);
            }

            logger.info(`${data.length} registros encontrados.`);
            return data;
        } catch (error) {
            logger.error('Erro ao buscar registros na folha de ponto:', error);
            throw error;
        }
    }

    async create(timeSheet) {
        try {
            logger.info('Controle de ponto recebido.');

            const { data, error } = await dataBase
                .from('folha_ponto')
                .upsert(timeSheet, { onConflict: ['nome', 'periodo'] })
                .select('*')

            if (!data || error) {
                logger.error('Não foi possível armazenar o controle de ponto.', { error });
                throw new AppError('Não foi possível armazenar o controle de ponto.', 404);
            }

            logger.info('Controle de ponto armazenado.');

            return data;
        } catch (error) {
            logger.error('Erro ao armazenar controle de ponto.');
            throw error;
        }
    }
}

export default new TimeSheetsRepository();