import service from '../services/order.service.js';

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
            const { idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue } = req.body;
            const nota_fiscal = req.file.filename;

            const result = await service.updateOrder(idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal);

            res.status(200).json({
                success: true,
                message: 'Nota fiscal armazenada.',
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
                message: 'Erro no servidor.'
            });
        }
    }

    async updateStatus(req, res) {
        try {
            const { idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue } = req.body;
            const result = await service.updateStatus(idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue);

            res.status(200).json({
                success: true,
                message: 'Status Atualizado.',
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
                message: 'Erro no servidor.'
            });
        }
    }
}

export default new OrderController();