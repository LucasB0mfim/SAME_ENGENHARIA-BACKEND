import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const CHAVE_SECRETA = process.env.CS;

/**
 * Função responsável por gerar um token JWT (JSON Web Token) no processo de login.
 * 
 * Esta função recebe o e-mail do colaborador como parâmetro e gera um token JWT usando a 
 * biblioteca 'jsonwebtoken' representada por 'jwt'. O token gerado contém
 * o e-mail do colaborador como payload e é assinado com uma chave secreta armazenada
 * em uma variável como 'CHAVE_SECRETA'. 
 * 
 * O token tem um tempo de expiração de 300 segundos (5 minutos), após o qual ele se tornará inválido.
 * 
 * Este token é utilizado como uma forma de autenticação para o colaborador, permitindo que ele acesse
 * recursos protegidos no sistema.
 */
export const generateToken = (email) => {
    return jwt.sign({ email }, CHAVE_SECRETA, { expiresIn: 1000 });
};

/**
 * Função responsável por validar um token JWT fornecido.
 * 
 * Esta função recebe um token JWT como parâmetro e tenta verificar sua validade usando a função 
 * 'jwt.verify' da biblioteca 'jsonwebtoken'. A validação é feita com a chave secreta 
 * armazenada na variável 'CHAVE_SECRETA', que foi usada para assinar o token.
 * 
 * Se o token for válido e não expirado, a função retorna o payload do token (informações decodificadas),
 * como o e-mail do colaborador. Caso contrário, ela captura o erro e retorna 'undefined', indicando que
 * o token é inválido ou expirado.
 */
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