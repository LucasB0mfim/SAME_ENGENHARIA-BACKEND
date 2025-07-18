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

    async findAdmission() {
        return await repository.findAll();
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

    async createEmployee(name, cpf, birthDate, phone, rg, pis, address, uniform, dailyVouchers, role, bootSize, childrenUnder14, instagram, linkedin, bloodType, emergencyName, relationship, emergencyPhone, allergy, chronicDisease, photo3x4, cpfImage, rgFront, rgBack, certificate, residenceProof) {

        const formattedBirthDate = birthDate
            ? `${birthDate.slice(4)}-${birthDate.slice(2, 4)}-${birthDate.slice(0, 2)}`
            : birthDate;

        const formattedParams = {
            name: name.trim().toUpperCase(),
            cpf: cpf.trim(),
            birthDate: formattedBirthDate,
            phone: phone.trim(),
            rg: rg.trim(),
            pis: pis.trim(),
            address: address?.trim().toUpperCase(),
            uniform: uniform,
            dailyVouchers: dailyVouchers || 0,
            role: role,
            bootSize: Number(bootSize) || 0,
            childrenUnder14: Number(childrenUnder14),
            instagram: instagram.trim().toLowerCase() || null,
            linkedin: linkedin.trim().toLowerCase() || null,
            bloodType: bloodType,
            emergencyName: emergencyName?.trim().toUpperCase(),
            relationship: relationship?.trim().toUpperCase(),
            emergencyPhone: emergencyPhone.trim(),
            allergy: allergy,
            chronicDisease: chronicDisease,
            photo3x4: photo3x4,
            cpfImage: cpfImage,
            rgFront: rgFront,
            rgBack: rgBack,
            certificate: certificate,
            residenceProof: residenceProof
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