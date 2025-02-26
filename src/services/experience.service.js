import repository from '../repositories/experience.repository.js';

class ExperienceService {
    async getExperience() {
        return await repository.findAll();
    }
}

export default new ExperienceService();