import repository from '../repositories/financial.repository.js';

class FinancialService {
    async getTrack() {
        return await repository.findByID();
    }
}

export default new FinancialService();
