import multer from "multer";

const storage = multer.diskStorage({
    destination: './src/uploads/notas_fiscais',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.png');
    }
})

const uploadNF = multer({ storage }).single('nota_fiscal');

export default uploadNF;