import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class BenefitRepository {

    async findEmployee() {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .select('*')

            if (error) {
                logger.error('Erro ao consultar a tabela beneficiary', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            return data
        } catch (error) {
            logger.error('Erro no método findModel: ', { error });
            throw error;
        }
    }

    async createEmployee(nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .insert({
                    nome: nome,
                    posicao: posicao,
                    setor: setor,
                    contrato: contrato,
                    centro_custo: centro_custo,
                    vr: vr,
                    vt: vt,
                    vc: vc,
                    vem: vem,
                })
                .select('*');

            if (error) {
                logger.error('Erro ao gravar dados na tabela beneficiary:', error)
                throw new AppError('Erro ao gravar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no create:', error);
            throw error;
        }
    }

    async update(id, nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .update({
                    nome: nome,
                    posicao: posicao,
                    setor: setor,
                    contrato: contrato,
                    centro_custo: centro_custo,
                    vr: vr,
                    vt: vt,
                    vc: vc,
                    vem: vem,
                })
                .eq('id', id)
                .select('*');

            if (error) {
                logger.error('Erro atualizar colaborador na tabela beneficiary:', error)
                throw new AppError('Erro ao atualizar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .delete()
                .eq('id', id)
                .select('*');

            if (error) {
                logger.error('Erro deletar colaborador na tabela beneficiary:', error)
                throw new AppError('Erro ao deletar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no delete:', error);
            throw error;
        }
    }

    async findRecord(correctDate) {
        try {
            const { data, error } = await dataBase
                .from('beneficiaries')
                .select('*')
                .eq('data', correctDate)

            if (error) {
                logger.error('Erro ao consultar a tabela beneficiary:', error);
                throw new AppError('Erro ao consultar a tabela.', 500);
            }

            if (!data) {
                throw new AppError('Registro vazio.', 404);
            }

            return data;
        } catch (error) {
            logger.error('Erro no método findRecord:', { error });
            throw error;
        }
    }

    async createRecord(record) {
        try {
            const records = record.map(({ ...rest }) => rest);

            const { data, error } = await dataBase
                .from('beneficiaries')
                .upsert(records, { onConflict: ['nome', 'data'], ignoreDuplicates: true })
                .select('*');

            if (error) {
                logger.error('Erro ao gravar dados na tabela beneficiaries:', error)
                throw new AppError('Erro ao gravar: ' + error.message, 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no create:', error);
            throw error;
        }
    }
}

export default new BenefitRepository();