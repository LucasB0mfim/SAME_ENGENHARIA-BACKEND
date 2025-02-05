import { z } from 'zod';

/**
 * Esquema de validação para o login de um colaborador.
 * 
 * Este esquema valida os dados fornecidos para o login, garantindo que o e-mail esteja no formato correto 
 * e que seja do domínio permitido '@sameengenharia.com.br'.
 * 
 * A validação acontece da seguinte forma:
 * - O e-mail deve ser uma string válida (verificado com a função 'z.string().email()').
 * - O e-mail não pode ser vazio 'min(1)', deve ter no máximo 255 caracteres 'max(255)', e 
 *   o domínio precisa ser o '@sameengenharia.com.br' (verificado pela função '.refine()').
 * 
 * Caso o e-mail não atenda a essas condições, serão lançadas mensagens de erro apropriadas.
 * 
 * @example
 * loginSchema.parse({ email: 'usuario@sameengenharia.com.br' });
 * 
 */
export const loginSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório')
        .max(255, 'Email muito longo')
        .refine(email => email.endsWith('@sameengenharia.com.br'), {
            message: 'Você não possui permissão para acessar',
        })
});

/**
 * Esquema de validação para a atualização dos dados de um colaborador.
 * 
 * Este esquema valida os dados fornecidos para atualizar o colaborador, garantindo que:
 * - O nome de usuário tenha entre 3 e 10 caracteres, e contenha apenas letras.
 * - O e-mail seja válido e pertença ao domínio '@sameengenharia.com.br'.
 * - A senha atual seja obrigatória e corresponda a um valor fixo (neste caso, 'same0106').
 * - A senha nova deve ter no mínimo 8 caracteres, ser composta por letras maiúsculas, minúsculas, números, 
 *   e um caractere especial.
 *
 * Caso qualquer uma das condições falhe, uma mensagem de erro é retornada.
 * 
 * @example
 * atualizarSchema.parse({
 *   usuario: 'NovoUsuario',
 *   email: 'usuario@sameengenharia.com.br',
 *   senhaAtual: 'same0106',
 *   senhaNova: 'NovaSenha123!'
 * });
 * 
 */
export const atualizarSchema = z.object({
    usuario: z.string()
        .min(3, 'Nome de usuário deve ter no mínimo 3 caracteres')
        .max(10, 'Nome de usuário deve ter no máximo 10 caracteres')
        .regex(/^[a-zA-Z]+$/, 'Nome de usuário deve conter apenas letras'),

    email: z.string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório')
        .refine(email => email.endsWith('@sameengenharia.com.br'), {
            message: 'O email deve pertencer ao domínio @sameengenharia.com.br',
        }),

    senhaAtual: z.string()
        .min(1, 'Senha atual é obrigatória')
        .refine(senha => senha === 'same0106', {
            message: 'Senha atual incorreta',
        }),

    senhaNova: z.string()
        .min(8, 'Senha nova deve ter no mínimo 8 caracteres')
        .max(100, 'Senha muito longa')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Senha nova deve conter letras maiúsculas, minúsculas, números e um caractere especial')
});