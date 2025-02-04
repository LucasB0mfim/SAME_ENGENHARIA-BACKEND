const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializa o express
const app = express();

// Define a porta de acesso
const PORT = 3000;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Usar o middleware cors para permitir todas as origens
app.use(cors());

app.listen(PORT, () => {
    console.log(`O servidor está rodando no http://localhost:${PORT}`);
})