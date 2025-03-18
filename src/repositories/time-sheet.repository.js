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

    async findByFilters(status, startDate, endDate) {
        try {
            logger.info(`Buscando registros na folha de ponto com filtros: status=${status}, startDate=${startDate}, endDate=${endDate}`);
    
            // Definir data final igual à inicial se não for fornecida
            const secondDate = endDate || startDate;
    
            const recordsPage = 1000;
            let currentPage = 0;
            let allRecords = [];
            let hasMoreData = true;
    
            while (hasMoreData) {
                const { data: records, error } = await dataBase
                    .from('folha_ponto')
                    .select('*')
                    .gte('PERIODO', startDate)
                    .lte('PERIODO', secondDate)
                    .order('PERIODO', { ascending: true })
                    .range(currentPage * recordsPage, (currentPage + 1) * recordsPage - 1);
    
                if (!records || error) {
                    logger.error('Não foi possível buscar os registros na folha de ponto.');
                    throw new AppError('Não foi possível buscar os registros na folha de ponto.', 404);
                }
    
                if (records.length > 0) {
                    allRecords = allRecords.concat(records);
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }
    
            // Aplicar filtros adicionais nos resultados já obtidos
            let filteredRecords = [...allRecords];
    
            // Filtrar por status (ausentes, presentes)
            if (status) {
                if (status.toLowerCase() === 'all') {
                    filteredRecords = filteredRecords.filter(record => (record.FALTA === 'SIM') || (record.FALTA === 'NÃO'));
                } else if (status.toLowerCase() === 'presents') {
                    filteredRecords = filteredRecords.filter(record => record.FALTA === 'NÃO');
                } else if (status.toLowerCase() === 'absent') {
                    filteredRecords = filteredRecords.filter(record => record.FALTA === 'SIM');
                } else if (status.toLowerCase() === 'vacation') {
                    filteredRecords = filteredRecords.filter(record => record['EVENTO ABONO'] === 'Férias');
                } else if (status.toLowerCase() === 'paid') {
                    filteredRecords = filteredRecords.filter(record => record['EVENTO ABONO'] === 'Gestor decidiu abonar');
                } else if (status.toLowerCase() === 'certificate') {
                    filteredRecords = filteredRecords.filter(record => record['EVENTO ABONO'] === 'Atestado Médico');
                }
            }
    
            logger.info(`${filteredRecords.length} registros encontrados após aplicação dos filtros.`);
    
            return filteredRecords;
        } catch (error) {
            logger.error('Erro ao buscar registros na folha de ponto.');
            throw error;
        }
    }
}

export default new TimeSheetsRepository();