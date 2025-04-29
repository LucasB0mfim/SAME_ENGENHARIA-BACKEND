import service from '../services/experience.service.js';

class ExperienceController {
    async getExperience(req, res) {
        try {
            const records = await service.getExperience();

            return res.status(200).json({
                success: true,
                message: 'Registros encontrados.',
                records
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            })
        }
    }

    async updateModality(req, res) {
        try {
            const { chapa, viajar, segmento } = req.body;
            const records = await service.updateModality(chapa, viajar, segmento);

            return res.status(200).json({
                success: true,
                message: 'Registros encontrados.',
                records
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            })
        }
    }
}

export default new ExperienceController();