import repository from '../repositories/order.repository.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async updateOrder(idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal) {
        return await repository.update(idprd, numero_oc, quantidade, valor_unitario, valor_total, status, data_entrega, registrado, quantidade_entregue, nota_fiscal);
    }

    async updateStatus(idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue) {
        return await repository.status(idprd, status, data_entrega, previsao_entrega, registrado, quantidade, quantidade_entregue);
    }
}

export default new OrderService();