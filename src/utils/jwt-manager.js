import jwt from 'jsonwebtoken';

const CHAVE_SECRETA = 'SAME_ENGENHARIA';

export const gerarTokenNoLogin = (email) => {
    return jwt.sign({ email }, CHAVE_SECRETA, { expiresIn: 300 });
};

export const validarToken = (token) => {
    let TOKEN_VALIDO = undefined;
    
    try {
        if (!token) {
            throw new Error('Token vazio.');
        }

        TOKEN_VALIDO = jwt.verify(token, CHAVE_SECRETA);
    } catch (error) {
        TOKEN_VALIDO = undefined;
    }

    return TOKEN_VALIDO;
};