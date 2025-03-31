import repository from '../repositories/order.repository.js';
import AppError from '../utils/errors/AppError.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async uploadNF(idprd, nota_fiscal) {
        if (!idprd || !nota_fiscal) throw new AppError('Os campos "idprd" e "nota_fiscal" são obrigatórios', 400);
        return await repository.upload(idprd, nota_fiscal);
    }

    async updateOrder(oc, idprd, centro_custo, fornecedor, valor_total, material, quantidade, valor_unitario, data_entrega) {
        return await repository.update(oc, idprd, centro_custo, fornecedor, valor_total, material, quantidade, valor_unitario, data_entrega);
    }
}

export default new OrderService();