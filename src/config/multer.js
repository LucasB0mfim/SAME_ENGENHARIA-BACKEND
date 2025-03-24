import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath para obter o caminho do arquivo
import fs from 'fs'; // Importa o módulo 'fs' para manipulação de arquivos

// Obtém o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url); // Obtém o caminho do arquivo atual
const __dirname = path.dirname(__filename); // Obtém o diretório do arquivo atual

// Caminho para a pasta uploads na raiz do projeto
const uploadsDir = path.join(__dirname, '../../', 'uploads'); // A pasta uploads será criada na raiz do projeto

// Verifica se o diretório 'uploads' existe, caso contrário, cria-o
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Diretório "uploads" criado com sucesso.');
}

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Define o diretório onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        console.log(`Arquivo recebido: ${filename}`); // Log do nome do arquivo
        cb(null, filename);
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

// Inicializa o multer com as configurações
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limita o tamanho do arquivo a 5MB
    }
});

export default upload;