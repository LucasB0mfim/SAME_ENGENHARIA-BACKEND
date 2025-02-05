import { validarToken } from '../utils/jwt-manager.js';

/**
 * Middleware responsável por autenticar o token de acesso presente no cabeçalho da requisição.
 * 
 * Este middleware verifica se um token JWT (JSON Web Token) foi enviado no cabeçalho 
 * da requisição, no campo 'Authorization'. Caso o token seja encontrado, ele é validado
 * e, se for válido e não expirado, o e-mail associado ao token é extraído e adicionado
 * ao objeto 'req' para ser utilizado nas próximas etapas da requisição.
 * 
 * Se o token não for enviado, ou se for inválido ou expirado, o middleware retorna uma 
 * resposta com o código de status adequado (401 para falta de token e 403 para token inválido/expirado).
 */
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'O token não foi enviado.' });
    }

    const TOKEN_DECODIFICADO = validarToken(token);

    if (!TOKEN_DECODIFICADO) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    req.email = TOKEN_DECODIFICADO.email;

    next();
};

export default autenticarToken;