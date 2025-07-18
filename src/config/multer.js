import multer from "multer";

const storage = multer.diskStorage({
    destination: './src/uploads/notas_fiscais',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.png');
    }
})

const admission = multer.diskStorage({
    destination: './src/uploads/admission',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.png');
    }
})

export const uploadNF = multer({ storage }).single('nota_fiscal');

export const uploadCSV = multer({ storage: multer.memoryStorage() }).single('folha_ponto');

export const uploadDocuments = multer({ storage: admission }).fields([
    { name: 'photo3x4', maxCount: 1 },
    { name: 'cpfImage', maxCount: 1 },
    { name: 'rgFront', maxCount: 1 },
    { name: 'rgBack', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'residenceProof', maxCount: 1 }
]);