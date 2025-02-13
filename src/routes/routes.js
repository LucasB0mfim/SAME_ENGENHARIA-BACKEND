// Importando a dependência express
import express from 'express';

// Importando os controllers
import LoginEmployeeController from '../controllers/LoginEmployeeController.js';
import UpdateEmployeeController from '../controllers/UpdateEmployeeController.js';

// Importando middlewares
import authToken from '../middlewares/authToken.js';
import authLogin from '../middlewares/authLogin.js';

// Importando Schemas
import { loginSchema, updateSchema } from '../validators/login.schema.js';
import checkHealth from '../middlewares/checkHealth.js';

// Iniciando as rotas
const router = express.Router();

// Rotas de acesso
router.get('/banco-de-dados/saude',
    checkHealth
);

router.post('/validar-token',
    authToken,
    LoginEmployeeController.token
);

router.post('/colaborador/logar',
    authLogin(loginSchema),
    LoginEmployeeController.authenticateEmployee
);

router.put('/colaborador/atualizar',
    authToken,
    authLogin(updateSchema),
    UpdateEmployeeController.updateEmployee
);

router.get('/dashboard', authToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bem-vindo, colaborador'
    });
});

// Exportando a rota
export default router;