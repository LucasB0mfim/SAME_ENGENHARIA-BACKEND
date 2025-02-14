import UpdateEmployeeRepository from '../repositories/UpdateEmployeeRepository.js';
import { generateToken } from '../utils/jwt-manager.js';
import AppError from '../utils/errors/AppError.js';

const repository = UpdateEmployeeRepository;

class UpdateEmployeeService {

    async updateEmployee(username, email, currentPassword, newPassword) {
        try {
            const result = await repository.update(username, email, currentPassword, newPassword);
            if (!result.success) {
                throw new AppError('Colaborador não encontrado.', 404);
            }
            return {
                token: generateToken(email)
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new UpdateEmployeeService();