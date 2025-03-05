import { z } from 'zod';
import dotenv from "dotenv";

dotenv.config();

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
export const firstLoginSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório')
        .max(255, 'Email muito longo')
        .refine(email => email.endsWith('@sameengenharia.com.br'), {
            message: 'Você não possui permissão para acessar a gestão.',
        }),

    password: z.string()
        .refine(senha => senha === process.env.SP, {
            message: 'email ou senha incorreto(s).'
        })
});

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
            message: 'Você não possui permissão para acessar a gestão.',
        }),

    password: z.string()
        .refine(senha => senha !== process.env.SP, {
            message: 'Colaborador não cadastrado.'
        })
});