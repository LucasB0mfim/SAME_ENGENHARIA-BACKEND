import express from 'express';

// Importando os controllers
import LoginController from '../controllers/LoginController.js';
import autenticarToken from '../middlewares/autenticar-token.js';

import validarAcesso from '../middlewares/validar-acesso.js';
import { loginSchema, atualizarSchema } from '../validators/schemas/login.schema.js';

// Iniciando as rotas
const router = express.Router();

// Rotas de acesso
router.post('/login', validarAcesso(loginSchema), LoginController.login);
router.post('/validar-token', autenticarToken, LoginController.token);
router.put('/atualizar-colaborador', autenticarToken, validarAcesso(atualizarSchema), LoginController.primeiroAcesso);

// Exportando a rota
export default router;