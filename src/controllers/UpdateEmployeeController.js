import UpdateEmployeeService from '../services/UpdateEmployeeService.js';

const service = UpdateEmployeeService;

class UpdateEmployeeController {

    constructor() {
        this.updateEmployee = this.updateEmployee.bind(this);
    }

    /**
     * Método responsável por cadastrar um novo colaborador.
     * 
     * Este método recebe uma requisição contendo os dados do colaborador no corpo da requisição,
     * chama o repositório de cadastro para registrar o colaborador
     * e retorna uma resposta com o status do cadastro.
     */

    async updateEmployee(req, res) {
        try {
            const { username, email, currentPassword, newPassword } = req.body;
            const { token } = await service.updateEmployee(username, email, currentPassword, newPassword);
            return res.status(200).json({
                success: true,
                message: 'Colaborador atualizado com sucesso.',
                token
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            };
            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor. Tente novamente mais tarde.'
            });
        };
    };
};

export default new UpdateEmployeeController();