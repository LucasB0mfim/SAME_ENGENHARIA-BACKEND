import repository from '../repositories/request.repository.js';

class RequestService {
    async getRequest() {
        return await repository.findAll();
    }
}

export default new RequestService();