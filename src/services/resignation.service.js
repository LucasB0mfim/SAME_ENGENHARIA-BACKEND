import { addDays } from 'date-fns';

import repository from '../repositories/resignation.repository.js';
import AppError from '../utils/errors/AppError.js';
import benefitRepository from '../repositories/benefit.repository.js';

class ResignationService {

    async findAll() {
        return await repository.findAll();
    }

    async findByStatus(status) {
        if (!status) throw new AppError('O campo "status" é obrigatório.', 400);
        return await repository.findByStatus(status);
    }

    async create(nome, status, modalidade, data_comunicacao, data_solicitacao, observacao) {
        if (!nome || !status || !modalidade || !data_comunicacao) throw new AppError('Os campos "nome", "status", "modalidade" e "data_comunicacao" são obrigatórios.', 400);
        const employee = await benefitRepository.findEmployeeByName(nome);
        return await repository.create(nome.toUpperCase(), employee.cpf, employee.funcao, employee.centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao.toUpperCase());
    }

    async update(id, nome, status, modalidade, data_inicio_aviso_trabalhado, modalidade_aviso_trabalhado, colaborador_comunicado, data_comunicacao, data_rescisao) {

        if (!id?.toString().trim() || !nome?.toString().trim() || !status?.toString().trim() || !modalidade?.toString().trim()) {
            throw new AppError('Os campos "id", "nome", "status" e "modalidade" são obrigatórios.', 400);
        }

        let dataDemissao = null;
        let dataUltimoDiaTrabalhado = null;
        let dataPagamentoRescisao = null;

        if (data_inicio_aviso_trabalhado === '') {
            dataUltimoDiaTrabalhado = data_comunicacao;
            dataDemissao = data_comunicacao;
        } else {
            dataDemissao = addDays(data_inicio_aviso_trabalhado, 29);
            dataPagamentoRescisao = addDays(data_inicio_aviso_trabalhado, 7);

            if (modalidade_aviso_trabalhado === 'REDUÇÃO DE DIAS') {
                dataUltimoDiaTrabalhado = addDays(data_inicio_aviso_trabalhado, 22);
            } else if (modalidade_aviso_trabalhado === 'REDUÇÃO DE CARGA HORARIA') {
                dataUltimoDiaTrabalhado = addDays(data_inicio_aviso_trabalhado, 29);
            } else {
                throw new AppError('O início do aviso trabalhado é incompátivel com a sua modalidade!', 422);
            }
        }

        return await repository.update(id, nome, status, modalidade, colaborador_comunicado, data_inicio_aviso_trabalhado, modalidade_aviso_trabalhado, data_rescisao, dataDemissao, dataUltimoDiaTrabalhado, dataPagamentoRescisao);
    }

    async delete(id) {
        if (!id) throw new AppError('O cmapo de "id" é obrigatório.');
        return await repository.delete(id);
    }
}

export default new ResignationService();