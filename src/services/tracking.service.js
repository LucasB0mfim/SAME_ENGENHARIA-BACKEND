import repository from '../repositories/tracking.repository.js';

class TrackingService {
    async getTracking() {
        return await repository.findAll();
    }
}

export default new TrackingService();