import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

class BenefitRepository {

    async findEmployee() {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .select('*')
                .order('nome', { ascending: true });

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

    async findAllCostCenter() {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .select('centro_custo, funcao');

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

    async findByCostCenter(centro_custo) {
        try {
            let query = dataBase
                .from('beneficiary')
                .select('id, nome, funcao, centro_custo, chapa')
                .order('nome', { ascending: true });

            if (centro_custo !== 'GERAL') {
                query = query.eq('centro_custo', centro_custo);
            }

            const { data, error } = await query;

            if (error) {
                logger.error('Erro ao consultar a tabela beneficiary', { error });
                throw new AppError('Não foi possível consultar a tabela.', 500);
            }

            return data;
        } catch (error) {
            logger.error('Erro no método findWorkforce: ', { error });
            throw error;
        }
    }

    async updateCostCenter(id, nome, centro_custo, funcao) {
        try {
            const { data, error } = await dataBase
                .from('beneficiary')
                .update({
                    centro_custo: centro_custo,
                    funcao: funcao
                })
                .eq('id', id)
                .eq('nome', nome)
                .select('id, nome, centro_custo, funcao');

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

    // ========== MÉTODOS PARA GERENCIAR COLABORADOR ========== //

    async createEmployee(nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {
        const { data, error } = await dataBase
            .from('beneficiary')
            .insert({
                nome: nome || null,
                chapa: chapa || '000000',
                cpf: cpf || '00000000000',
                data_nascimento: data_nascimento || null,
                funcao: funcao || null,
                setor: setor || null,
                contrato: contrato || null,
                centro_custo: centro_custo || null,
                recebe_integral: recebe_integral || 'NÃO',
                vr_caju: vr_caju || 0,
                vr_vr: vr_vr || 0,
                vc_caju: vc_caju || 0,
                vc_vr: vc_vr || 0,
                vt_caju: vt_caju || 0,
                vt_vem: vt_vem || 0,
                vr_caju_fixo: vr_caju_fixo || 'NÃO',
                vr_vr_fixo: vr_vr_fixo || 'NÃO',
                vc_caju_fixo: vc_caju_fixo || 'NÃO',
                vc_vr_fixo: vc_vr_fixo || 'NÃO',
                vt_caju_fixo: vt_caju_fixo || 'NÃO',
                vt_vem_fixo: vt_vem_fixo || 'NÃO'
            })
            .select('*');

        if (error) {
            logger.error('Erro ao gravar dados na tabela beneficiary:', error)
            throw new AppError('Erro ao gravar: ' + error.message, 500);
        }

        return data;
    }

    async updateEmployee(id, nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {
        const { data, error } = await dataBase
            .from('beneficiary')
            .update({
                nome: nome || null,
                chapa: chapa || '000000',
                cpf: cpf || '00000000000',
                data_nascimento: data_nascimento || '0000-00-00',
                funcao: funcao || null,
                setor: setor || null,
                contrato: contrato || null,
                centro_custo: centro_custo || null,
                recebe_integral: recebe_integral || 'NÃO',
                vr_caju: vr_caju || 0,
                vr_vr: vr_vr || 0,
                vc_caju: vc_caju || 0,
                vc_vr: vc_vr || 0,
                vt_caju: vt_caju || 0,
                vt_vem: vt_vem || 0,
                vr_caju_fixo: vr_caju_fixo || 'NÃO',
                vr_vr_fixo: vr_vr_fixo || 'NÃO',
                vc_caju_fixo: vc_caju_fixo || 'NÃO',
                vc_vr_fixo: vc_vr_fixo || 'NÃO',
                vt_caju_fixo: vt_caju_fixo || 'NÃO',
                vt_vem_fixo: vt_vem_fixo || 'NÃO'
            })
            .eq('id', id)
            .select();

        if (error) {
            logger.error('Erro atualizar colaborador na tabela beneficiary:', error)
            throw new AppError('Erro ao atualizar: ' + error.message, 500);
        }

        return data;
    }

    async deleteEmployee(id) {
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
    }
}

export default new BenefitRepository();