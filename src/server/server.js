import fs from 'fs';
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";

import config from "../config/cors.js";
import routes from "../routes/routes.js";

// Guarda as chaves para conexão com o banco
dotenv.config();

// Inicializa o express
const app = express();

// Define a porta de acesso
const PORT = process.env.PS;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Obtém o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url); // Obtém o caminho do arquivo atual
const __dirname = path.dirname(__filename); // Obtém o diretório do arquivo atual

// Caminho para a pasta uploads (agora na raiz do projeto)
const uploadsPath = path.join(__dirname, '../../', 'uploads'); // A pasta uploads está na raiz do projeto

// Verifica se a pasta uploads existe, caso contrário, cria-a
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log('Diretório "uploads" criado com sucesso.');
}

// Log do caminho da pasta uploads para depuração
console.log('Caminho da pasta uploads:', uploadsPath);

// Configura o diretório de uploads para servir arquivos estáticos
app.use('/uploads', express.static(uploadsPath));

// Usar o middleware cors para permitir todas as origens
app.use(cors(config));

// Rota padrão para todos os endpoints
app.use('/same-engenharia/api', routes);

// Responsável por escutar a porta definida pela variável 'PORT'
app.listen(PORT, () => {
    console.log(`O servidor está rodando no http://localhost:${PORT}`);
});