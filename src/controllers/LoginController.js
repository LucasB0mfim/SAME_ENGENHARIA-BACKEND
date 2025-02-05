import LoginRepository from '../repositories/LoginRepository.js';

class LoginController {

    constructor() {
        this.repository = LoginRepository;
        this.login = this.login.bind(this);
        this.token = this.token.bind(this);
    }

    /**
     * Método responsável por realizar o login de um colaborador.
     * 
     * Este método recebe os dados de login (e-mail e senha) enviados no corpo da requisição, 
     * e tenta autenticar o colaborador utilizando essas informações. Ele chama o método 'autenticar'
     * do repositório para validar as credenciais.
     * 
     * Se as credenciais estiverem corretas, o método gera um token e retorna uma resposta com status 
     * HTTP 200 (OK), incluindo o token gerado.
     * 
     * Caso as credenciais estejam incorretas (se o e-mail ou senha forem inválidos), o método captura o erro 
     * e retorna uma resposta com o código de status 401 (não autorizado), além de uma mensagem de erro.
     * Para qualquer outro erro, o status retornado será 500 (erro interno do servidor).
     */
    async autenticarColaborador(req, res) {
        try {
            const { email, senha } = req.body;
            const token = await this.repository.autenticar(email, senha);

            return res.status(200).json({ success: true, token });
        } catch (error) {
            const status = error.message === 'Email ou senha inválidos' ? 401 : 500;

            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Método responsável por retornar para a requisição que o token fornecido por ele é válido.
     * 
     * Caso o token esteja incorreto, expirado ou seja inexistente, o middleware autenticar-token.js
     * fará a validação necessária.
     */
    async token(req, res) {
        return res.json({ message: 'Token Válido', email: req.email });
    }
}

export default new LoginController();