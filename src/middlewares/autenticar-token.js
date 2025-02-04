import { validarToken } from '../utils/jwt-manager.js';

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