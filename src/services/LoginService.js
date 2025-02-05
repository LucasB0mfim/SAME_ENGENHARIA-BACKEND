import LoginRepository from '../repositories/LoginRepository.js';
import { gerarTokenNoLogin } from '../utils/jwt-manager.js';

class LoginService {

    async autenticar(email, senha) {
        try {
            const colaborador = await LoginRepository.autenticar(email, senha);
            return { colaborador, token: gerarTokenNoLogin(email) };
        } catch (error) {
            throw new Error('Email ou senha inválidos');
        }
    }

    async validarToken(email) {
        return { message: 'Token válido', email };
    }
}

export default new LoginService();