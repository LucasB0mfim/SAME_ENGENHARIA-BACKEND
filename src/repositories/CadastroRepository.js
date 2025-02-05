import conexao from "../database/conexao.js";
import validarAcesso from "../utils/auth-manager.js";
import { gerarTokenNoLogin } from '../utils/jwt-manager.js';

class CadastroRepository {

    /**
     * Método privado responsável por atualizar as informações do colaborador no banco de dados.
     * 
     * Este método recebe os parâmetros 'usuario', 'email', 'senhaAtual', e 'senhaNova' e tenta 
     * atualizar o usuário e a senha do colaborador com base nas informações fornecidas.
     * 
     * Ele realiza uma operação de atualização na tabela 'colaboradores' do banco de dados, 
     * verificando se o 'email' e a 'senhaAtual' correspondem aos dados existentes.
     */
    async #atualizar(usuario, email, senhaAtual, senhaNova) {
        const { data, error } = await conexao
            .from('colaboradores')
            .update({ usuario, senha: senhaNova })
            .eq('email', email)
            .eq('senha', senhaAtual)
            .select();

        if (error) throw new Error('Erro ao atualizar colaborador: ' + error.message);

        return data;
    }

    /**
     * Método responsável por cadastrar um novo colaborador, após validar suas credenciais e atualizar 
     * suas informações no banco de dados.
     * 
     * Este método recebe os dados do novo colaborador ('usuario', 'email', 'senhaAtual', 'senhaNova'), 
     * realiza a validação das credenciais (verificando se o e-mail e a senha atual são válidos), 
     * e, se as credenciais forem corretas, chama o método privado '#atualizar' para atualizar as informações 
     * do colaborador. Por fim, gera um token de login para o colaborador.
     */
    async cadastrar(novoColaborador) {
        try {
            const { usuario, email, senhaAtual, senhaNova } = novoColaborador;
            await validarAcesso(email, senhaAtual);
            await this.#atualizar(usuario, email, senhaAtual, senhaNova);
            return gerarTokenNoLogin(email);
        } catch (error) {
            throw new Error('Credenciais inválidas');
        }
    }
}

export default new CadastroRepository();