// Importando a dependência express
import express from 'express';

// Importando os controllers
import employeeController from '../controllers/employee.controller.js';

// Importando middlewares
import authToken from '../middlewares/authToken.js';
import authLogin from '../middlewares/authLogin.js';

// Importando Schemas
import { firstLoginSchema, loginSchema, updateSchema } from '../validators/login.schema.js';
import checkDatabaseHealth from '../middlewares/checkHealth.js';

// Iniciando as rotas
const router = express.Router();

// Rotas de acesso
router.get('/employees',
    authToken,
    employeeController.getAllEmployees
);

router.get('/employee',
    authToken,
    employeeController.getEmployeeByEmail
);

router.put('/employee',
    authToken,
    authLogin(updateSchema),
    employeeController.updateEmployee
);

router.post('/employee',
    authToken,
    employeeController.createEmployee
);

router.delete('/employee',
    authToken,
    employeeController.deleteEmployee
);

router.post('/auth/employee/login',
    authLogin(loginSchema),
    employeeController.authenticateEmployee
);

router.post('/auth/employee/first-login',
    authLogin(firstLoginSchema),
    employeeController.authenticateEmployee
);

router.post('/auth/validate-token',
    employeeController.validateEmployeeToken
);

router.get('/health',
    checkDatabaseHealth
);

router.get('/employee/dashboard', authToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bem-vindo a área de trabalho!'
    });
});

// Exportando a rota
export default router;