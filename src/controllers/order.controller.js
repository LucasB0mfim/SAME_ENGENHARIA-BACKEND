import service from '../services/order.service.js';
import AppError from '../utils/errors/AppError.js';

class OrderController {
    async getOrder(req, res) {
        try {
            const order = await service.getOrder();

            return res.status(200).json({
                success: true,
                message: 'Pedidos encontrados com sucesso.',
                order
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

    async updateOrder(req, res) {
        try {
            const { status, quantidade_entregue, urgencia, oc, ultima_atualizacao, data_entrega } = req.body; // Extrai o OC do corpo da requisição
            
            const nota_fiscal = req.file ? `uploads/${req.file.filename}` : null; // Caminho relativo
    
            const order = await service.updateOrder(status, quantidade_entregue, urgencia, nota_fiscal, oc, ultima_atualizacao, data_entrega);
    
            return res.status(200).json({
                success: true,
                message: 'Pedido atualizado com sucesso.',
                order
            });
        } catch (error) {
            console.error('Erro ao atualizar o pedido:', error); // Log do erro
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

export default new OrderController();