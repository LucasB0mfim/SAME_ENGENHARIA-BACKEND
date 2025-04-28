import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class TiRepository {
    async getTickets() {
        try {
            logger.info('Buscando todos os tickets.');

            const { data, error } = await dataBase
                .from('ti_tickets')
                .select('*')

            if (!data || error) {
                logger.error('Falha ao buscar colaboradores', { error });
                throw new AppError('Não foi possível retornar os colaboradores.', 404);
            }

            logger.info(`Foram encontrados ${data.length} tickets.`);

            return data;
        } catch (error) {
            logger.error(`Erro ao buscar os tickets: ${error.message}`);
            throw error;
        }
    }

    async create(description, subject, role, applicant_email) {
        try {
            logger.info(`Criando novo ticket de: ${applicant_email}`);

            const { data, error } = await dataBase
                .from('ti_tickets')
                .insert({
                    description: description,
                    subject: subject,
                    role: role,
                    applicant_email: applicant_email
                })
                .select('*')

            if (!data || error) {
                logger.error('Falha ao inserir novo ticket.', { error });
                throw new AppError('Falha ao inserir novo ticket.', 404);
            }

            logger.info(`Ticket armazenado com sucesso.`);

            return data;
        } catch (error) {
            logger.error(`Erro ao armazenar ticket: ${error.message}`);
            throw error;
        }
    }

    async update(id, status, resolution, responsible_technician, closing_date) {
        try {
            logger.info(`Atualizando ticket: ${id}`);

            const { data, error } = await dataBase
                .from('ti_tickets')
                .update({
                    status: status,
                    resolution: resolution,
                    responsible_technician: responsible_technician,
                    closing_date: closing_date
                })
                .eq('id', id)
                .select('*')

            if (!data || error) {
                logger.error('Falha ao atualizar ticket.', { error });
                throw new AppError('Falha ao atualizar ticket.', 404);
            }

            logger.info(`Ticket atualizado com sucesso.`);

            return data;
        } catch (error) {
            logger.error(`Erro ao atualizar ticket: ${error.message}`);
            throw error;
        }
    }
}

export default new TiRepository();