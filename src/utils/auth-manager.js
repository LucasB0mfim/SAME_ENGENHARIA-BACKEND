import conexao from "../database/conexao.js";

/**
 * Função responsável por autenticar as credenciais de acesso de um colaborador.
 * 
 * Esta função recebe o e-mail e a senha fornecidos pelo colaborador e realiza uma consulta
 * ao banco de dados para verificar se existe um colaborador com essas credenciais.
 * 
 * A validação é feita utilizando o banco de dados através de uma conexão com
 * com o banco de dados. A função realiza uma busca na tabela 'colaboradores' para
 * encontrar um registro onde o e-mail e a senha coincidem. Caso um colaborador 
 * com essas credenciais seja encontrado, os dados do colaborador são retornados.
 * 
 * Se não houver um colaborador com essas credenciais ou ocorrer algum erro na consulta, a função
 * lança um erro com a mensagem 'Credenciais Inválidas', informando que o e-mail ou a senha estão incorretos.
 */
async function autenticarColaborador(email, senha) {
    const { data, error } = await conexao.from('colaboradores')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .single();

    if (error || !data) {
        throw new Error('Credenciais Inválidas');
    }

    return data;
}

export default autenticarColaborador;
