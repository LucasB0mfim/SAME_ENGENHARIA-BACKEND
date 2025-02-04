import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

// Guarda as chaves para conexão com o banco
dotenv.config();

// Configuração de acesso
const conexao = createClient(
    process.env.SB_URL, 
    process.env.SB_KEY    
);

export default conexao;