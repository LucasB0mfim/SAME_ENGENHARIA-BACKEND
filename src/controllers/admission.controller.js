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
}

export default new AdmissionController();
