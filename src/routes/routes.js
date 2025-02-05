// Importando a dependência express
import express from 'express';

// Importando os controllers
import LoginController from '../controllers/LoginController.js';
import CadastroController from '../controllers/CadastroController.js'

// Importando middlewares
import autenticarToken from '../middlewares/autenticar-token.js';
import autenticarLogin from '../middlewares/autenticar-login.js';

// Importando Schemas
import { loginSchema, atualizarSchema } from '../validators/login.schema.js';
import verificarSaude from '../middlewares/verificar-saude.js';

// Iniciando as rotas
const router = express.Router();

// Rotas de acesso
router.get('/banco-de-dados/saude', verificarSaude);

router.post('/validar-token', autenticarToken, LoginController.token);

router.post('/colaborador/logar', autenticarLogin(loginSchema), LoginController.autenticarColaborador);
router.put('/colaborador/atualizar', autenticarToken, autenticarLogin(atualizarSchema), CadastroController.cadastrarColaborador);

// Exportando a rota
export default router;