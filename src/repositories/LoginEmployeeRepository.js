import authEmployee from '../utils/auth-manager.js';
import AppError from '../utils/errors/AppError.js';

class LoginEmployeeRepository {

    /**
     * Método responsável por autenticar o colaborador com base no e-mail e password fornecidos.
     * 
     * Este método recebe o e-mail e a password do colaborador e tenta validar as credenciais usando 
     * a função authEmployee. Caso a validação seja bem-sucedida, o método gera e retorna um token 
     * de login para o colaborador utilizando a função 'generateToken'.
     * 
     * Se a validação das credenciais falhar, o método captura o erro e lança uma exceção,
     * indicando que as credenciais fornecidas são incorretas.
     */
    async login(email, password) {
        try {
            const employee = await authEmployee(email, password);
            return {
                success: true,
                message: 'Colaborador logado com sucesso.',
                employee
            };
        } catch (error) {
            if (error.message === 'email ou senha incorreto(s).') {
                throw new AppError('email ou senha incorreto(s).', 404);
            };
            throw new AppError('Erro ao logar colaborador.', 500);
        };
    };
};

export default new LoginEmployeeRepository();