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
router.get('/dataBase/Health',
    checkHealth
);

router.post('/validateToken',
    authToken,
    LoginEmployeeController.token
);

router.post('/employee/login',
    authLogin(loginSchema),
    LoginEmployeeController.authenticateEmployee
);

router.put('/employee/update',
    authToken,
    authLogin(updateSchema),
    UpdateEmployeeController.updateEmployee
);

router.get('/employee/dashboard', authToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bem-vindo a área de trabalho!'
    });
});

// Exportando a rota
export default router;