import service from '../services/financial.service.js';

class FinancialController {
    async getTrack(req, res) {
        try {
            const result = await service.getTrack();

            return res.status(200).json({
                success: true,
                message: 'IDS encontrados.',
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
                message: 'Erro no servidor.'
            });
        }
    }
};

export default new FinancialController();