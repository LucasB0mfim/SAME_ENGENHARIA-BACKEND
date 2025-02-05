import conexao from "../database/conexao.js";

const verificarSaude = async (req, res) => {
    try {
        await conexao.from('colaboradores').select('count').single();
        res.status(200).json({ status: 'O banco de dados está funcionando normalmente.' });
    } catch (error) {
        res.status(503).json({ status: 'O banco de dados não está funcionando como o esperado.', error: error.message });
    }
}

export default verificarSaude;