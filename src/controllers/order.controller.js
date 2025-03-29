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

    async uploadNF(req, res) {
        try {
            const { idprd } = req.body;
            const nota_fiscal = req.file.filename;

            await service.updateNF(idprd, nota_fiscal);

            res.status(200).json({
                success: true,
                message: 'Nota fiscal armazenada.'
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
                message: 'Erro no servidor.'
            });
        }
    }
}

export default new OrderController();