import service from '../services/admission.service.js';
import dotenv from "dotenv";

dotenv.config();

class AdmissionController {

    async generateLink(req, res) {
        try {
            const token = await service.generateToken();
            const link = `${process.env.URL}/admission?token=${token}`;

            return res.status(200).json({
                success: true,
                message: 'Link gerado com sucesso.',
                link
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

    async findAdmission(req, res) {
        try {

            const result = await service.findAdmission();

            return res.status(200).json({
                success: true,
                message: 'Consulta realizada com sucesso.',
                result
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

    async deleteAdmission(req, res) {
        try {
            const { id } = req.params;

            await service.deleteAdmission(id);

            return res.status(200).json({
                success: true,
                message: 'Admissão deletada com sucesso.',
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async createEmployee(req, res) {
        try {
            const { name, cpf, birthDate, phone, rg, pis, address, uniform, dailyVouchers, role, bootSize, childrenUnder14, instagram, linkedin, bloodType, emergencyName, relationship, emergencyPhone, allergy, chronicDisease } = req.body;

            const files = req.files;

            const photo3x4 = files?.photo3x4?.[0]?.filename || null;
            const cpfImage = files?.cpfImage?.[0]?.filename || null;
            const rgFront = files?.rgFront?.[0]?.filename || null;
            const rgBack = files?.rgBack?.[0]?.filename || null;
            const certificate = files?.certificate?.[0]?.filename || null;
            const residenceProof = files?.residenceProof?.[0]?.filename || null;

            const result = await service.createEmployee(name, cpf, birthDate, phone, rg, pis, address, uniform, dailyVouchers, role, bootSize, childrenUnder14, instagram, linkedin, bloodType, emergencyName, relationship, emergencyPhone, allergy, chronicDisease, photo3x4, cpfImage, rgFront, rgBack, certificate, residenceProof);

            res.status(200).json({
                success: true,
                message: 'Dados enviados com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

}

export default new AdmissionController();
