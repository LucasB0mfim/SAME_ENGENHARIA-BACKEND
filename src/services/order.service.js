import repository from '../repositories/order.repository.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async updateOrder(status, quantidade_entregue, urgencia, nota_fiscal, oc) {
        return await repository.update(status, quantidade_entregue, urgencia, nota_fiscal, oc);
    }
}

export default new OrderService();