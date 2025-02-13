import { ZodError } from 'zod';

/**
 * Middleware responsável por validar os dados de entrada com base no esquema fornecido.
 * 
 * Este middleware recebe um esquema de validação (usando a biblioteca 'zod'), valida os dados 
 * presentes no corpo da requisição ('req.body'), e, caso a validação seja bem-sucedida, 
 * passa os dados validados para o próximo middleware ou controlador utilizando o 'next()'.
 * 
 * Se a validação falhar, o middleware captura o erro e retorna uma resposta com status 400 
 * (Bad Request) contendo detalhes sobre os campos inválidos e suas respectivas mensagens de erro.
 * Caso o erro não seja relacionado à validação (por exemplo, erro interno do servidor), 
 * ele retorna uma resposta com status 500 (erro interno do servidor).
 */
export const authLogin = (schema) => async (req, res, next) => {
    try {
        const dadosValidados = await schema.parseAsync(req.body);
        req.body = dadosValidados;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: error.errors.map(err => ({
                    campo: err.path.join('.'),
                    mensagem: err.message
                }))
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

export default authLogin;