import LoginEmployeeRepository from '../repositories/LoginEmployeeRepository.js';
import { generateToken } from '../utils/jwt-manager.js';

const repository = LoginEmployeeRepository;

class LoginEmployeeService {

    async authenticateEmployee(email, password) {
        try {
            const employee = await repository.login(email, password);
            return {
                employee,
                token: generateToken(email)
            };
        } catch (error) {
            throw new Error('Email ou senha inválidos');
        }
    }

    async validarToken(email) {
        return { message: 'Token válido', email };
    }
}

export default new LoginEmployeeService();