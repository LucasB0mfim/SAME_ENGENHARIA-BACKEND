import autenticarColaborador from '../utils/auth-manager.js';
import { gerarTokenNoLogin } from '../utils/jwt-manager.js';

class LoginRepository {

    /**
     * Método responsável por autenticar o colaborador com base no e-mail e senha fornecidos.
     * 
     * Este método recebe o e-mail e a senha do colaborador e tenta validar as credenciais usando 
     * a função autenticarColaborador. Caso a validação seja bem-sucedida, o método gera e retorna um token 
     * de login para o colaborador utilizando a função 'gerarTokenNoLogin'.
     * 
     * Se a validação das credenciais falhar, o método captura o erro e lança uma exceção,
     * indicando que as credenciais fornecidas são incorretas.
     */
    async autenticar(email, senha) {
        try {
            await autenticarColaborador(email, senha);
            return gerarTokenNoLogin(email);
        } catch (error) {
            throw new Error('Email ou senha inválidos');
        }
    }
}

export default new LoginRepository();