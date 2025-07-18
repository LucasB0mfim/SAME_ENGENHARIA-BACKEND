import express from 'express';

import { uploadNF, uploadCSV, uploadDocuments } from '../config/multer.js';

// Importando os controllers
import EmployeeController from '../controllers/employee.controller.js';
import TimeSheetController from '../controllers/time-sheet.controller.js';
import ExperienceController from '../controllers/experience.controller.js';
import TrackingController from '../controllers/tracking.controller.js';
import OrderController from '../controllers/order.controller.js';
import IndicatorController from '../controllers/indicator.controller.js';
import BenefitController from '../controllers/benefit.controller.js';
import GeneralController from '../controllers/general.controller.js';
import FinancialController from '../controllers/financial.controller.js';
import AdmissionController from '../controllers/admission.controller.js';

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
    authToken,
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
);

router.post('/reports/timesheet',
    authToken,
    TimeSheetController.getRecordsByName
);

router.post('/reports/csv',
    authToken,
    uploadCSV,
    TimeSheetController.uploadTimeSheet
);

router.post('/reports/extra-day',
    authToken,
    uploadCSV,
    TimeSheetController.addExtraDay
);

router.post('/reports/timesheet/filters',
    authToken,
    TimeSheetController.getRecordsByFilters
);

router.post('/timesheet/download/layout',
    authToken,
    TimeSheetController.downloadLayoutTotvs
);

router.get('/experience/reports',
    authToken,
    ExperienceController.getExperience
);

router.get('/experience/download',
    authToken,
    ExperienceController.convertToExcel,
);

router.put('/experience/update',
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

router.get('/benefit/employee',
    authToken,
    BenefitController.findEmployee
);

router.post('/benefit/employee',
    authToken,
    BenefitController.createEmployee
);

router.put('/benefit/employee',
    authToken,
    BenefitController.updateEmployee
);

router.delete('/benefit/delete/employee/:id',
    authToken,
    BenefitController.deleteEmployee
);

router.delete('/benefit/delete/record/:id',
    authToken,
    BenefitController.deleteEmployeeRecord
);

router.delete('/benefit/delete/:month',
    authToken,
    BenefitController.deleteMonth
);

router.post('/benefit/find-report',
    authToken,
    BenefitController.findRecord
);

router.post('/benefit/medias',
    authToken,
    BenefitController.getBenefitMedia
);

router.post('/benefit/create-report',
    authToken,
    BenefitController.createRecord
);

router.post('/benefit/update',
    authToken,
    BenefitController.updateRecord
);

router.post('/benefit/donwload/layout-vr',
    authToken,
    BenefitController.downloadLayoutVr
);

router.post('/benefit/donwload/layout-caju',
    authToken,
    BenefitController.downloadLayoutCaju
);

router.post('/benefit/donwload/layout-vem',
    authToken,
    BenefitController.downloadLayoutVem
);

router.get('/notice',
    authToken,
    GeneralController.getNotice
);

router.get('/comment',
    authToken,
    GeneralController.getComment
);

router.post('/comment',
    authToken,
    GeneralController.sendComment
);

router.get('/financial/track',
    authToken,
    FinancialController.getTrack
);

router.get('/admission/find-admission',
    authToken,
    AdmissionController.findAdmission
);

router.post('/admission/generate-link',
    authToken,
    AdmissionController.generateLink
);

router.delete('/admission/delete/:id',
    authToken,
    AdmissionController.deleteAdmission
);

router.post('/admission/create-admission',
    authToken,
    uploadDocuments,
    AdmissionController.createEmployee
);

router.use('/admission/documents',
    express.static('./src/uploads/admission')
);

// Exportando a rota
export default router;