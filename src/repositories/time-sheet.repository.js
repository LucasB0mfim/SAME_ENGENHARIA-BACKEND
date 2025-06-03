import pool from '../database/sql-server.js';
import dataBase from '../database/dataBase.js';
import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

class TimeSheetsRepository {
    async findAll() {
        try {
            logger.info(`Buscando todos os registros da folha de ponto.`);

            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('timesheet')
                    .select('*')
                    .order('nome', { ascending: true })
                    .order('periodo', { ascending: true })
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

            logger.info(`${allRecords.length} registros encontrados.`);

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

    async findByFilters(costCenter, status, startDate, endDate) {
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
            let finalCostCenter = costCenter;

            if (!startDate && !endDate) {
                finalStartDate = '2025-01-15';
                finalEndDate = getCurrentDate();
            } else if (startDate && !endDate) {
                finalEndDate = getCurrentDate();
            } else if (!startDate && endDate) {
                finalStartDate = new Date();
            }

            logger.info(`Buscando registros na folha de ponto com filtros: costCenter='${costCenter}', status='${status}', startDate='${finalStartDate}', endDate='${finalEndDate}'`);

            let query = dataBase
                .from('timesheet')
                .select('*')
                .order('nome', { ascending: true })
                .order('periodo', { ascending: true })

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

            // Filtro de centro de custo
            if (finalCostCenter && finalCostCenter !== 'Geral') {
                query = query.eq('centro_custo', finalCostCenter);
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

    async findByMonth(startDate, endDate) {
        const perPage = 1000;
        let page = 0;
        let allData = [];
        let hasMore = true;

        try {
            while (hasMore) {
                const from = page * perPage;
                const to = from + perPage - 1;

                const { data, error } = await dataBase
                    .from('timesheet')
                    .select('*')
                    .gte('periodo', startDate)
                    .lte('periodo', endDate)
                    .range(from, to);

                if (error) {
                    logger.error('Erro ao consultar tabela timesheet.', { error });
                    throw new AppError('Erro ao consultar tabela timesheet.', 500);
                }

                if (data) {
                    allData = allData.concat(data);
                    hasMore = data.length === perPage;
                    page++;
                } else {
                    hasMore = false;
                }
            }

            return allData;
        } catch (error) {
            logger.error('Erro ao buscar registros na folha de ponto:', error);
            throw error;
        }
    }

    async create(timeSheet) {
        try {
            logger.info('Controle de ponto recebido.');

            const { data, error } = await dataBase
                .from('timesheet')
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

    async findCostCenter() {
        let connection;
        try {
            logger.info('Buscando dados de centro de custo.');
            connection = await pool.connect();

            const result = await connection.request().query('exec employees');

            if (!result.recordset || result.recordset.length === 0) {
                logger.error('Nenhum dado de centro de custo encontrado.');
                throw new AppError('Nenhum dado de centro de custo encontrado.', 404);
            }

            logger.info(`${result.recordset.length} registros de centro de custo encontrados.`);

            // Formata o resultado com a estrutura desejada
            const formattedResult = {
                success: true,
                message: "Registros encontrados.",
                records: result.recordset.map(record => ({
                    chapa: record.chapa,
                    centro_custo: record.centro_custo,
                    funcionario: record.funcionario
                }))
            };

            return formattedResult.records;
        } catch (error) {
            logger.error('Erro ao buscar dados de centro de custo:', error);
            throw new AppError('Erro ao buscar dados de centro de custo.', 500);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

export default new TimeSheetsRepository();