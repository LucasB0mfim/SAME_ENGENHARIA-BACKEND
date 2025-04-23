import { z } from 'zod';
import dotenv from "dotenv";

dotenv.config();

/**
 * Esquema de validação para a atualização dos dados de um colaborador.
 * 
 * Este esquema valida os dados fornecidos para atualizar o colaborador, garantindo que:
 * - O nome de usuário tenha entre 3 e 10 caracteres, e contenha apenas letras.
 * - O e-mail seja válido e pertença ao domínio '@sameengenharia.com.br'.
 * - A senha atual seja obrigatória e corresponda a um valor fixo (neste caso, 'Same@0106').
 * - A senha nova deve ter no mínimo 8 caracteres, ser composta por letras maiúsculas, minúsculas, números, 
 *   e um caractere especial.
 *
 * Caso qualquer uma das condições falhe, uma mensagem de erro é retornada.
 * 
 * @example
 * updateSchema.parse({
 *   usuario: 'NovoUsuario',
 *   email: 'usuario@sameengenharia.com.br',
 *   senhaAtual: 'Same@0106',
 *   senhaNova: 'NovaSenha123!'
 * });
 * 
 */
export const updateSchema = z.object({
    username: z.string()
        .max(15, 'Nome de usuário deve ter no máximo 15 caracteres'),

    email: z.string()
        .min(1, 'Email é obrigatório'),

    currentPassword: z.string()
        .min(1, 'Senha atual é obrigatória')
        .max(250, 'Tamanho máximo da senha: 250 caracteres'),

    newPassword: z.string()
        .min(8, 'Senha nova deve ter no mínimo 8 caracteres')
        .max(250, 'Tamanho máximo da senha: 250 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
            'Senha nova deve conter letras maiúsculas, minúsculas, números e um caractere especial')
});