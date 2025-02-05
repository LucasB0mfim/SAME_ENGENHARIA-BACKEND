import CadastroRepository from '../repositories/CadastroRepository.js';

class CadastroService {

    async cadastrarColaborador(dadosColaborador) {
        try {
            const colaborador = await CadastroRepository.cadastrar(dadosColaborador);
            return { colaborador, token: gerarTokenNoLogin(dadosColaborador.email) };
        } catch (error) {
            throw new Error('Credenciais inválidas');
        }
    }
}

export default new CadastroService();