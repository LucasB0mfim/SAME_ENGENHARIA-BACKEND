import dataBase from '../database/dataBase.js';
import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

class AdmissionRepository {
    async findByStatus(status) {
        try {
            let query = dataBase.from('admission').select('*');

            if (status !== 'TODOS') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) {
                logger.error('Erro ao consultar a tabela admission:', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no método findByStatus:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const { data, error } = await dataBase
                .from('admission')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                logger.error('Erro ao consultar a tabela admission:', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro ao consultar pelo id:', error);
            throw error;
        }
    }

    async create(
        name,
        cpf,
        birthDate,
        phone,
        rg,
        pis,
        address,
        uniform,
        dailyVouchers,
        role,
        bootSize,
        childrenUnder14,
        instagram,
        linkedin,
        bloodType,
        emergencyName,
        relationship,
        emergencyPhone,
        allergy,
        chronicDisease,
        photo3x4,
        cpfImage,
        rgFront,
        rgBack,
        certificate,
        residenceProof
    ) {
        try {

            const { data, error } = await dataBase
                .from('admission')
                .insert({
                    name,
                    cpf,
                    birth_date: birthDate,
                    phone,
                    rg,
                    pis,
                    address,
                    uniform,
                    daily_vouchers: dailyVouchers,
                    role,
                    boot_size: bootSize,
                    children_under_14: childrenUnder14,
                    instagram,
                    linkedin,
                    blood_type: bloodType,
                    emergency_name: emergencyName,
                    relationship,
                    emergency_phone: emergencyPhone,
                    allergy,
                    chronic_disease: chronicDisease,
                    photo_3x4: photo3x4,
                    cpf_image: cpfImage,
                    rg_front: rgFront,
                    rg_back: rgBack,
                    certificate,
                    residence_proof: residenceProof
                })
                .select('*');

            if (error) {
                logger.error('Erro ao inserir na tabela admission:', error);
                throw new AppError(`Erro ao inserir dados: ${error.message}`, 500);
            }

            logger.info('Dados de um novo colaborador foram armazenados:', data);
            return data;
        } catch (error) {
            logger.error('Erro no método create:', error);
            throw error;
        }
    }

    async update(id, status) {
        try {
            const { data, error } = await dataBase
                .from('admission')
                .update({ status })
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                logger.warn(`Falha ao atualizar admissão do ID: ${id}`, error);
                throw new AppError(`Não foi possível atualizar essa admissão: ${error.message}`, 400);
            }

            logger.info(`Status da admissão do id ${id} atualizado com sucesso.`);
            return data;
        } catch (error) {
            logger.error(`Falha ao atualizar a admissão do ID ${id}`, error);
            throw new AppError('Não foi possível atualizar.', 400);
        }
    }

    async delete(id) {
        try {
            const { data, error } = await dataBase
                .from('admission')
                .delete()
                .eq('id', id)
                .select('*');

            if (error) {
                logger.error('Erro ao deletar admissão na tabela admission:', error);
                throw new AppError('Erro ao deletar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no método delete:', error);
            throw error;
        }
    }
}

export default new AdmissionRepository();