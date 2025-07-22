import repository from '../repositories/experience.repository.js';
import AppError from '../utils/errors/AppError.js';

class ExperienceService {
    async getExperience() {
        return await repository.findAll();
    }
}

export default new ExperienceService();