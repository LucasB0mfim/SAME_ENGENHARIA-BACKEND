import updateEmployee from "../utils/update-manager.js";
import AppError from "../utils/errors/AppError.js";

class UpdateEmployeeRepository {

    /**
     * Método responsável por cadastrar um novo colaborador, após validar suas credenciais e atualizar 
     * suas informações no banco de dados.
     * 
     * Este método recebe os dados do novo colaborador ('usuario', 'email', 'senhaAtual', 'senhaNova'), 
     * realiza a validação das credenciais (verificando se o e-mail e a senha atual são válidos), 
     * e, se as credenciais forem corretas, chama o método privado '#atualizar' para atualizar as informações 
     * do colaborador. Por fim, gera um token de login para o colaborador.
     */

    async update(username, email, currentPassword, newPassword) {
        try {
            const data = await updateEmployee(username, email, currentPassword, newPassword);
            if (!data) {
                throw new Error('Credênciais inválidas.');
            }
            return {
                success: true
            };
        } catch (error) {
            if (error.message === 'Credênciais inválidas.') {
                throw new AppError('Credênciais inválidas.', 404);
            };
            throw new AppError('Erro ao atualizar colaborador.', 500);
        };
    };
};

export default new UpdateEmployeeRepository();