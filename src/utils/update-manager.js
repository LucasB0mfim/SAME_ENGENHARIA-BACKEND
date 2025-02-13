import dataBase from "../database/dataBase.js";

/**
 * Método privado responsável por atualizar as informações do colaborador no banco de dados.
 * 
 * Este método recebe os parâmetros 'username', 'email', 'currentPassword', e 'newPasswaord' e tenta 
 * atualizar o usuário e a senha do colaborador com base nas informações fornecidas.
 * 
 * Ele realiza uma operação de atualização na tabela 'colaboradores' do banco de dados, 
 * verificando se o 'email' e a 'currentPassword' correspondem aos dados existentes.
 */
async function updateEmployee(username, email, currentPassword, newPasswaord) {
    const { data, error } = await dataBase
        .from('colaboradores')
        .update({ usuario: username, senha: newPasswaord })
        .eq('email', email)
        .eq('senha', currentPassword)
        .select();

    if (error) throw new Error('Erro ao atualizar colaborador: ' + error.message);
    return data;
}

export default updateEmployee;