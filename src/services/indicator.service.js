import repository from '../repositories/indicator.repository.js';

class IndicatorService {
    async getCostCenter() {
        return await repository.findCostCenter();
    }
}

export default new IndicatorService();