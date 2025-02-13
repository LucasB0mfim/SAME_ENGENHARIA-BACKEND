import UpdateEmployeeRepository from '../repositories/UpdateEmployeeRepository.js';
import { generateToken } from '../utils/jwt-manager.js';
import AppError from '../utils/errors/AppError.js';

const repository = UpdateEmployeeRepository;

class UpdateEmployeeService {

    async updateEmployee(employee) {
        try {
            const newEmployee = await repository.update(employee);
            if (!newEmployee) {
                throw new AppError('Colaborador não encontrado.', 404);
            }
            return {
                newEmployee,
                token: generateToken(employee.email)
            };
        } catch (error) {
            throw new error;
        }
    }
}

export default new UpdateEmployeeService();