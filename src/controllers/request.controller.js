import service from '../services/request.service.js';

class RequestController {
    async getRequest(req, res) {
        try {
            const request = await service.getRequest();

            return res.status(200).json({
                success: true,
                message: 'Pedidos encontrado com sucesso.',
                request
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

export default new RequestController();