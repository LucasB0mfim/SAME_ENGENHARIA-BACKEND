import CadastroService from '../services/CadastroService.js';

class CadastroController {

    constructor() {
        this.cadastrarColaborador = this.cadastrarColaborador.bind(this);
    }

    /**
     * Método responsável por cadastrar um novo colaborador.
     * 
     * Este método recebe uma requisição contendo os dados do colaborador no corpo da requisição,
     * chama o repositório de cadastro para registrar o colaborador
     * e retorna uma resposta com o status do cadastro.
     */
    async cadastrarColaborador(req, res) {
        try {
            const colaborador = req.body;
            const resultado = await CadastroService.cadastrarColaborador(colaborador);
            return res.status(200).json({ success: true, message: resultado });
        } catch (error) {
            const status = error.message === 'Credenciais inválidas' ? 401 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }
}

export default new CadastroController();