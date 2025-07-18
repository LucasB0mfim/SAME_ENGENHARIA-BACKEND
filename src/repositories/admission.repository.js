import dataBase from '../database/dataBase.js';

import logger from '../utils/logger/winston.js';
import AppError from '../utils/errors/AppError.js';

class AdmissionRepository {

    async findAll() {
        try {
            const { data, error } = await dataBase
                .from('admission')
                .select('*')

            if (error) {
                logger.error('Erro ao consultar a tabela admission', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data
        } catch (error) {
            logger.error('Erro no método findAdmission: ', { error });
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
                logger.error('Erro ao consultar a tabela admission', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data
        } catch (error) {
            logger.error('Erro ao consultar pelo id.', { error });
            throw error;
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
                logger.error('Erro deletar admissão na tabela admission:', error)
                throw new AppError('Erro ao deletar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no delete:', error);
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
            logger.info('Recebida a solicitação para atualizar pedido.');

            const { data, error } = await dataBase
                .from('admission')
                .insert({
                    name: name,
                    cpf: cpf,
                    birth_date: birthDate,
                    phone: phone,
                    rg: rg,
                    pis: pis,
                    address: address,
                    uniform: uniform,
                    daily_vouchers: dailyVouchers,
                    role: role,
                    boot_size: bootSize,
                    children_under_14: childrenUnder14,
                    instagram: instagram,
                    linkedin: linkedin,
                    blood_type: bloodType,
                    emergency_name: emergencyName,
                    relationship: relationship,
                    emergency_phone: emergencyPhone,
                    allergy: allergy,
                    chronic_disease: chronicDisease,
                    photo_3x4: photo3x4,
                    cpf_image: cpfImage,
                    rg_front: rgFront,
                    rg_back: rgBack,
                    certificate: certificate,
                    residence_proof: residenceProof
                })
                .select('*')

            logger.info('Dados de um novo colaborador foram armazenados.');

            return data;
        } catch (error) {
            logger.error('Erro ao salvar dados de um novo colaborador.');
            throw error;
        }
    }
}

export default new AdmissionRepository();