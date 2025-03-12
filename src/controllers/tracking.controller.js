import service from '../services/tracking.service.js';

class TrackingController {
    async getTracking(req, res) {
        try {
            const tracking = await service.getTracking();

            return res.status(200).json({
                success: true,
                message: 'Rastreamento encontrado com sucesso.',
                tracking
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
}

export default new TrackingController()