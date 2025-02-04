import conexao from '../database/conexão.js';
import { gerarTokenNoLogin } from '../utils/jwt-manager.js';

class LoginRepository {

    // Função auxiliar
    async #compararCredenciais(email, senha) {
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

    // Função para atualizar o usuário e a senha do colaborador no primeiro acesso
    async #atualizarDados(usuario, email, senhaAtual, senhaNova) {
        const { data, error } = await conexao
            .from('colaboradores')
            .update({ usuario, senha: senhaNova })
            .eq('email', email)
            .eq('senha', senhaAtual)
            .select();

        if (error) {
            throw new Error('Erro ao atualizar colaborador: ' + error.message);
        }

        return data;
    }

    // Método para autentar o login
    async autenticar(email, senha) {
        try {
            // Compara se os dados batem e gera o token
            await this.#compararCredenciais(email, senha);
            return gerarTokenNoLogin(email);
        } catch (error) {
            // Propaga erros específicos do domínio
            throw new Error('Credenciais Inválidas');
        }
    }

    // Método para adicionar um usuário e uma nova senha no primeiro acesso
    async atualizar(usuario, email, senhaAtual, senhaNova) {
        try {
            await this.#compararCredenciais(email, senhaAtual);
            await this.#atualizarDados(usuario, email, senhaAtual, senhaNova);
            return gerarTokenNoLogin(email);
        } catch (error) {
            // Propaga erros específicos do domínio
            throw new Error('Credenciais Inválidas');
        }
    }
}

export default new LoginRepository();