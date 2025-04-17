import express from 'express';

import { uploadNF, uploadCSV } from '../config/multer.js';

// Importando os controllers
import EmployeeController from '../controllers/employee.controller.js';
import TimeSheetController from '../controllers/time-sheet.controller.js';
import ExperienceController from '../controllers/experience.controller.js';
import TrackingController from '../controllers/tracking.controller.js';
import OrderController from '../controllers/order.controller.js';
import IndicatorController from '../controllers/indicator.controller.js';

// Importando middlewares
import authToken from '../middlewares/authToken.js';
import authLogin from '../middlewares/authLogin.js';

// Importando Schemas
import { firstLoginSchema, loginSchema } from '../validators/login.schema.js';
import { updateSchema } from '../validators/update.schema.js';
import checkDatabaseHealth from '../middlewares/checkHealth.js';
import authUpdate from '../middlewares/authUpdate.js';

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
    authUpdate(updateSchema),
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

router.get('/reports/timesheets',
    TimeSheetController.getAllRecords
)

router.post('/reports/timesheet',
    TimeSheetController.getRecordsByName
)

router.post('/reports/csv',
    uploadCSV,
    TimeSheetController.uploadTimeSheet
);

router.post('/reports/timesheet/filters',
    TimeSheetController.getRecordsByFilters
)

router.get('/reports/experience',
    ExperienceController.getExperience
);

router.get('/reports/tracking',
    TrackingController.getTracking
);

router.get('/reports/request',
    OrderController.getOrder
);

router.put('/reports/request',
    uploadNF,
    OrderController.updateOrder
);

router.put('/order/update',
    OrderController.updateStatus
);

router.use('/notas_fiscais',
    express.static('./src/uploads/notas_fiscais')
);

router.use('/indicators/cost-center',
    IndicatorController.getCostCenter
);

// Exportando a rota
export default router;