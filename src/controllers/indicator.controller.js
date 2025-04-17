import service from '../services/indicator.service.js';

class IndicatorController {
    async getCostCenter(req, res) {
        try {
            const result = await service.getCostCenter();

            return res.status(200).json({
                success: true,
                message: 'Indicadores de centro de custo encontrados.',
                result
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

export default new IndicatorController();