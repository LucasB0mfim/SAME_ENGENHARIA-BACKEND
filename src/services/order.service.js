import repository from '../repositories/order.repository.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async updateOrder(status, quantidade_entregue, numero_oc, idprd, ultima_atualizacao, recebedor, nota_fiscal) {
        return await repository.update(status, quantidade_entregue, numero_oc, idprd, ultima_atualizacao, recebedor, nota_fiscal);
    }
}

export default new OrderService();