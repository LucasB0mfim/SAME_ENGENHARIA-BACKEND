import express from 'express';

// Importando os controllers
import LoginController from '../controllers/LoginController.js';
import autenticarToken from '../middlewares/autenticar-token.js';

// Iniciando as rotas
const router = express.Router();

// Rotas de acesso
router.post('/login', LoginController.login);
router.post('/validar-token', autenticarToken, LoginController.token);
router.put('/atualizar-colaborador', autenticarToken, LoginController.primeiroAcesso);

// Exportando a rota
export default router;