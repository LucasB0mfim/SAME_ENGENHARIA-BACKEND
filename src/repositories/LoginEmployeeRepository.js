import authEmployee from '../utils/auth-manager.js';

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
        const employee = await authEmployee(email, password);

        if (!employee) {
            throw new Error('O colaborador não foi encontrado');
        }

        return employee;
    }
}

export default new LoginEmployeeRepository();