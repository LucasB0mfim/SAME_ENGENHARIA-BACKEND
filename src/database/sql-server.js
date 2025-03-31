import sql from "mssql";
import dotenv from "dotenv";

// Guarda as chaves para conexão com o banco
dotenv.config();

// Configuração inicial
const conexao = {
    user: process.env.DB_USER,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(conexao);

export default pool;