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

    async createEmployee(nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .insert({
                    nome: nome,
                    chapa: chapa,
                    cpf: cpf,
                    data_nascimento: data_nascimento,
                    funcao: funcao,
                    setor: setor,
                    contrato: contrato,
                    centro_custo: centro_custo,
                    recebe_integral: recebe_integral,
                    vr_caju: vr_caju,
                    vr_vr: vr_vr,
                    vc_caju: vc_caju,
                    vc_vr: vc_vr,
                    vt_caju: vt_caju,
                    vt_vem: vt_vem,
                    vr_caju_fixo: vr_caju_fixo,
                    vr_vr_fixo: vr_vr_fixo,
                    vc_caju_fixo: vc_caju_fixo,
                    vc_vr_fixo: vc_vr_fixo,
                    vt_caju_fixo: vt_caju_fixo,
                    vt_vem_fixo: vt_vem_fixo

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

    async update(id, nome, chapa, cpf, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .update({
                    nome: nome,
                    chapa: chapa,
                    cpf: cpf,
                    funcao: funcao,
                    setor: setor,
                    contrato: contrato,
                    centro_custo: centro_custo,
                    recebe_integral: recebe_integral,
                    vr_caju: vr_caju,
                    vr_vr: vr_vr,
                    vc_caju: vc_caju,
                    vc_vr: vc_vr,
                    vt_caju: vt_caju,
                    vt_vem: vt_vem,
                    vr_caju_fixo: vr_caju_fixo,
                    vr_vr_fixo: vr_vr_fixo,
                    vc_caju_fixo: vc_caju_fixo,
                    vc_vr_fixo: vc_vr_fixo,
                    vt_caju_fixo: vt_caju_fixo,
                    vt_vem_fixo: vt_vem_fixo
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

    async deleteRecord(id) {
        try {
            const { data, error } = await dataBase
                .from('beneficiaries')
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

    async deleteMonth(data) {
        try {
            const { data: record, error } = await dataBase
                .from('beneficiaries')
                .delete()
                .eq('data', data)
                .select('*');

            if (error) {
                logger.error('Erro deletar mês na tabela beneficiaries:', error)
                throw new AppError('Erro ao deletar: ' + error.message, 500);
            }

            return record;
        } catch (error) {
            logger.error('Erro no delete:', error);
            throw error;
        }
    }

    async findRecord(correctDate, centro_custo) {
        try {
            let query = dataBase
                .from('beneficiaries')
                .select('*')
                .eq('data', correctDate)
                .order('nome', { ascending: true });

            if (centro_custo) {
                query = query.eq('centro_custo', centro_custo);
            }

            const { data, error } = await query;

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

    async updateRecord(data, nome, reembolso, dias_uteis, dias_nao_uteis, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_caju_fixo, vr_vr, vr_vr_fixo, vc_caju, vc_caju_fixo, vc_vr, vc_vr_fixo, vt_caju, vt_caju_fixo, vt_vem, vt_vem_fixo) {
        try {
            const { data: records, error } = await dataBase
                .from('beneficiaries')
                .update({
                    reembolso: reembolso,
                    dias_uteis: dias_uteis,
                    dias_nao_uteis: dias_nao_uteis,
                    funcao: funcao,
                    setor: setor,
                    contrato: contrato,
                    centro_custo: centro_custo,
                    recebe_integral: recebe_integral,
                    vr_caju: vr_caju,
                    vr_vr: vr_vr,
                    vc_caju: vc_caju,
                    vc_vr: vc_vr,
                    vt_caju: vt_caju,
                    vt_vem: vt_vem,
                    vr_caju_fixo: vr_caju_fixo,
                    vr_vr_fixo: vr_vr_fixo,
                    vc_caju_fixo: vc_caju_fixo,
                    vc_vr_fixo: vc_vr_fixo,
                    vt_caju_fixo: vt_caju_fixo,
                    vt_vem_fixo: vt_vem_fixo
                })
                .eq('nome', nome)
                .eq('data', data)
                .select('*');

            if (error) {
                logger.error('Erro atualizar colaborador na tabela beneficiaries:', error)
                throw new AppError('Erro ao atualizar: ' + error.message, 500);
            }

            return records;
        } catch (error) {
            logger.error('Erro no update:', error);
            throw error;
        }
    }
}

export default new BenefitRepository();