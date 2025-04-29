import repository from '../repositories/experience.repository.js';
import AppError from '../utils/errors/AppError.js';

class ExperienceService {
    async getExperience() {
        return await repository.findAll();
    }

    async updateModality(chapa, viajar, segmento) {
        if (!chapa || !viajar || !segmento) {
            throw new AppError('Todos os campos são obrigatórios');
        }

        return await repository.update(chapa, viajar, segmento);
    }
}

export default new ExperienceService();