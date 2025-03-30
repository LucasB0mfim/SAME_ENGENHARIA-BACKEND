import multer from "multer";

const storage = multer.diskStorage({
    destination: './src/uploads/notas_fiscais',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.png');
    }
})

export const uploadNF = multer({ storage }).single('nota_fiscal');

export const uploadCSV = multer({ storage: multer.memoryStorage() }).single('folha_ponto');