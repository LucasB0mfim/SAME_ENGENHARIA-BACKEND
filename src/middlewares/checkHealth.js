import dataBase from "../database/dataBase.js";

const checkHealth = async (req, res) => {
    try {
        await dataBase.from('colaboradores').select('count').single();
        res.status(200).json({ status: 'O banco de dados está funcionando normalmente.' });
    } catch (error) {
        res.status(503).json({ status: 'O banco de dados não está funcionando como o esperado.', error: error.message });
    }
}

export default checkHealth;