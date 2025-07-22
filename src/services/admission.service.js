import { generateTempToken } from '../utils/jwt-manager.js';
import repository from '../repositories/admission.repository.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';
import fs from 'fs/promises';
import path from 'path';

class AdmissionService {
    async generateToken() {
        return generateTempToken();
    }

    async updateAdmission(id, status) {
        if (!id || !status) throw new AppError('O campo "id" e "status" são obrigatórios.', 404);
        return await repository.update(id, status);
    }

    async findAdmission(status) {
        if (!status) throw new AppError("O campo 'status' é obrigatório.", 404);
        return await repository.findByStatus(status);
    }

    async deleteAdmission(id) {
        if (!id) throw new AppError('O campo "id" é obrigatório.', 400);
        const isEmployeeExists = await repository.findById(id);
        if (!isEmployeeExists) throw new AppError('Admissão não encontrada.', 404);

        const images = ['photo_3x4', 'cpf_image', 'rg_front', 'rg_back', 'certificate', 'residence_proof'];
        for (const image of images) {
            const filePath = isEmployeeExists[image];
            if (filePath) {
                const fullPath = path.resolve('./src/uploads/admission', filePath);
                try {
                    await fs.unlink(fullPath);
                } catch (error) {
                    logger.warn(`Erro ao deletar arquivo ${filePath}: ${error.message}`);
                }
            } else {
                logger.info(`Nenhum arquivo encontrado para o campo ${image}.`);
            }
        }

        logger.info(`Documentos de admissão do ID ${id} deletados com sucesso.`);
        return await repository.delete(id);
    }

    async createEmployee(name, cpf, birthDate, phone, rg, pis, address, uniform, dailyVouchers, role, bootSize, childrenUnder14, instagram, linkedin, bloodType, emergencyName, relationship, emergencyPhone, allergy, chronicDisease, photo3x4, cpfImage, rgFront, rgBack, certificate, residenceProof, useVT) {

        if (!name || !cpf || !birthDate || !phone || !rg || !address || !uniform || !role || !bloodType || !emergencyName || !relationship || !emergencyPhone || !allergy || !chronicDisease || !photo3x4 || !cpfImage || !rgFront || !rgBack || !certificate || !residenceProof) {
            throw new AppError('Todos os campos obrigatórios devem ser preenchidos.', 400);
        }

        let formattedBirthDate = null;
        if (birthDate) {
            try {
                const day = birthDate.slice(0, 2);
                const month = birthDate.slice(2, 4);
                const year = birthDate.slice(4, 8);
                formattedBirthDate = `${year}-${month}-${day}`;
                // Verifica se a data é válida
                const date = new Date(formattedBirthDate);
                if (isNaN(date.getTime())) {
                    throw new AppError('Formato de data de nascimento inválido.', 400);
                }
            } catch (error) {
                logger.error('Erro ao formatar birthDate:', error);
                throw new AppError('Formato de data de nascimento inválido.', 400);
            }
        }

        const formattedParams = {
            name: name?.trim().toUpperCase() || '',
            cpf: cpf?.trim() || '',
            birthDate: formattedBirthDate,
            phone: phone?.trim() || '',
            rg: rg?.trim() || '',
            pis: pis?.trim() || '00000000000',
            address: address?.trim().toUpperCase() || '',
            uniform: uniform || '',
            dailyVouchers: dailyVouchers ? Number(dailyVouchers) : 0,
            role: role || '',
            bootSize: bootSize ? Number(bootSize) : 0,
            childrenUnder14: childrenUnder14 ? Number(childrenUnder14) : 0,
            instagram: instagram?.trim().toLowerCase() || null,
            linkedin: linkedin?.trim().toLowerCase() || null,
            bloodType: bloodType || '',
            emergencyName: emergencyName?.trim().toUpperCase() || '',
            relationship: relationship?.trim().toUpperCase() || '',
            emergencyPhone: emergencyPhone?.trim() || '',
            allergy: allergy || '',
            chronicDisease: chronicDisease || '',
            photo3x4: photo3x4 || null,
            cpfImage: cpfImage || null,
            rgFront: rgFront || null,
            rgBack: rgBack || null,
            certificate: certificate || null,
            residenceProof: residenceProof || null,
            useVT: useVT || 'NÃO'
        };

        return await repository.create(
            formattedParams.name,
            formattedParams.cpf,
            formattedParams.birthDate,
            formattedParams.phone,
            formattedParams.rg,
            formattedParams.pis,
            formattedParams.address,
            formattedParams.uniform,
            formattedParams.dailyVouchers,
            formattedParams.role,
            formattedParams.bootSize,
            formattedParams.childrenUnder14,
            formattedParams.instagram,
            formattedParams.linkedin,
            formattedParams.bloodType,
            formattedParams.emergencyName,
            formattedParams.relationship,
            formattedParams.emergencyPhone,
            formattedParams.allergy,
            formattedParams.chronicDisease,
            formattedParams.photo3x4,
            formattedParams.cpfImage,
            formattedParams.rgFront,
            formattedParams.rgBack,
            formattedParams.certificate,
            formattedParams.residenceProof
        );
    }
}

export default new AdmissionService();