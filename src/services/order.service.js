import repository from '../repositories/order.repository.js';
import AppError from '../utils/errors/AppError.js';

class OrderService {
    async getOrder() {
        return await repository.findAll();
    }

    async updateNF(idprd, nota_fiscal) {
        if (!idprd || !nota_fiscal) throw new AppError('Os campos "idprd" e "nota_fiscal" são obrigatórios', 400);
        return await repository.update(idprd, nota_fiscal);
    }
}

export default new OrderService();