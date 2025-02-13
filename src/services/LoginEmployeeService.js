import LoginEmployeeRepository from '../repositories/LoginEmployeeRepository.js';
import { generateToken } from '../utils/jwt-manager.js';

const repository = LoginEmployeeRepository;

class LoginEmployeeService {

    async authenticateEmployee(email, password) {
        try {
            const employee = await repository.login(email, password);
            if (!employee) {
                throw new AppError('email ou senha incorreto(s).', 404);
            };
            return generateToken(email);
        } catch (error) {
            throw error;
        };
    };

    async validarToken(email) {
        return { message: 'Token válido', email };
    };
};

export default new LoginEmployeeService();