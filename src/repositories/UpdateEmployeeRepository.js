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
    
    async update(employee) {
        try {
            const updatedEmployee = await updateEmployee(employee);
            return {
                success: true,
                message: 'Colaborador Atualizado.',
                data: updatedEmployee
            };
        } catch (error) {
            if (error.statusCode) {
                console.error('Erro controlado:', error);
                throw error;
            }
            throw new AppError('Erro ao atualizar colaborador no banco de dados.', 500);
        };
    };
};

export default new UpdateEmployeeRepository();