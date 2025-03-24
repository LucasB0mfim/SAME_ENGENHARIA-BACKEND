import repository from '../repositories/order.repository.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async updateOrder(status, quantidade_entregue, urgencia, nota_fiscal, oc, ultima_atualizacao, data_entrega) {
        return await repository.update(status, quantidade_entregue, urgencia, nota_fiscal, oc, ultima_atualizacao, data_entrega);
    }
}

export default new OrderService();