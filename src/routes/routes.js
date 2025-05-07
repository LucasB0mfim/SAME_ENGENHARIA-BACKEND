import express from 'express';

import { uploadNF, uploadCSV } from '../config/multer.js';

// Importando os controllers
import EmployeeController from '../controllers/employee.controller.js';
import TimeSheetController from '../controllers/time-sheet.controller.js';
import ExperienceController from '../controllers/experience.controller.js';
import TrackingController from '../controllers/tracking.controller.js';
import OrderController from '../controllers/order.controller.js';
import IndicatorController from '../controllers/indicator.controller.js';
import TiController from '../controllers/ti.controller.js';
import BenefitController from '../controllers/benefit.controller.js';

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
    authToken,
    checkDatabaseHealth
);

router.get('/reports/timesheets',
    authToken,
    TimeSheetController.getAllRecords
)

router.post('/reports/timesheet',
    authToken,
    TimeSheetController.getRecordsByName
)

router.post('/reports/csv',
    authToken,
    uploadCSV,
    TimeSheetController.uploadTimeSheet
);

router.post('/reports/extra-day',
    authToken,
    uploadCSV,
    TimeSheetController.AddExtraDay
);

router.post('/reports/timesheet/filters',
    authToken,
    TimeSheetController.getRecordsByFilters
)

router.get('/reports/experience',
    authToken,
    ExperienceController.getExperience
);

router.put('/reports/experience',
    authToken,
    ExperienceController.updateModality
);

router.get('/reports/tracking',
    authToken,
    TrackingController.getTracking
);

router.get('/reports/request',
    authToken,
    OrderController.getOrder
);

router.put('/reports/request',
    authToken,
    uploadNF,
    OrderController.updateOrder
);

router.put('/order/update',
    authToken,
    OrderController.updateStatus
);

router.use('/notas_fiscais',
    authToken,
    express.static('./src/uploads/notas_fiscais')
);

router.get('/indicators/cost-center',
    authToken,
    IndicatorController.getCostCenter
);

router.get('/ti/tickets',
    authToken,
    TiController.getTicket
);

router.post('/ti/tickets',
    authToken,
    TiController.createTicket
);

router.put('/ti/tickets',
    authToken,
    TiController.updateTicket
);

router.get('/reports/benefit',
    BenefitController.getEmployees
);

router.post('/reports/benefit',
    authToken,
    BenefitController.getBusinessDays
);

router.post('/test',
    BenefitController.createDate
);

// Exportando a rota
export default router;