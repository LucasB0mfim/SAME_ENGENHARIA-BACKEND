// Importando a dependência express
import express from 'express';

// Importando os controllers
import EmployeeController from '../controllers/employee.controller.js';
import TimeSheetController from '../controllers/time-sheet.controller.js';
import experienceController from '../controllers/experience.controller.js';

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
    EmployeeController.getAllEmployees
);

router.get('/employee',
    EmployeeController.getEmployeeByToken
);

router.put('/employee',
    authToken,
    authLogin(updateSchema),
    EmployeeController.updateEmployee
);

router.post('/employee',
    authToken,
    EmployeeController.createEmployee
);

router.delete('/employee',
    authToken,
    EmployeeController.deleteEmployee
);

router.post('/auth/employee/login',
    authLogin(loginSchema),
    EmployeeController.authenticateEmployee
);

router.post('/auth/employee/first-login',
    authLogin(firstLoginSchema),
    authToken,
    EmployeeController.authenticateEmployee
);

router.post('/auth/validate-token',
    EmployeeController.validateEmployeeToken
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

router.get('/reports/timeheets',
    TimeSheetController.getAllRecords
)

router.get('/reports/timeheet',
    TimeSheetController.getRecordsByChapa
)

router.get('/reports/timeheet/period',
    TimeSheetController.getRecordsByPeriod
)

router.get('/tabela',
    authToken,
    experienceController.getExperience
);

// Exportando a rota
export default router;