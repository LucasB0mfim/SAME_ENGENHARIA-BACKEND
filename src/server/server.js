import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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

// Usar o middleware cors para permitir todas as origens
app.use(cors(config));

// Rota padrão para todos os endpoints
app.use('/same-engenharia/api', routes);

// Responsável por escutar a porta definida pela variável 'PORT'
app.listen(PORT, () => {
    console.log(`O servidor está rodando no http://localhost:${PORT}`);
})