import LoginRepository from '../repositories/LoginRepository.js';

class LoginController {

    constructor() {
        this.repository = LoginRepository;
        this.login = this.login.bind(this);
        this.token = this.token.bind(this);
        this.primeiroAcesso = this.primeiroAcesso.bind(this);
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const token = await this.repository.autenticar(email, senha);

            console.log('Credenciais Válidas');
            return res.status(200).json({ success: true, token });
        } catch (error) {
            // Se o erro retornado for esse texto o status vira 401
            const status = { 'Credenciais Inválidas': 401 };

            // Usa o [error.message] como chave para buscar o status
            [error.message] || 500;

            // Envia o motivo do erro
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async token(req, res) {
        return res.json({ message: 'Token Válido', email: req.email });
    }

    async primeiroAcesso(req, res) {
        try {
            const { usuario, email, senhaAtual, senhaNova } = req.body;

            if (!usuario || !email || !senhaAtual || !senhaNova) {
                return res.status(400).json({ message: 'Os campos (usuario, email, senhaAtual, senhaNova) são obrigatórios.' });
            }

            const resultado = await this.repository.atualizar(usuario, email, senhaAtual, senhaNova);

            console.log('Conta atualizada com sucesso');
            return res.status(200).json({ success: true, message: resultado });
        } catch (error) {
            // Envia o motivo do erro
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new LoginController();