import fs from 'fs';
import path from 'path';

import service from '../services/benefit.service.js';

class BenefitController {

    async findEmployee(req, res) {
        try {
            const result = await service.findEmployee();

            return res.status(200).json({
                success: true,
                message: 'Colaboradores encontrados.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async createEmployee(req, res) {
        try {
            const { nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem } = req.body;
            const result = await service.createEmployee(nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);

            return res.status(200).json({
                success: true,
                message: 'Colaborador criado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async updateEmployee(req, res) {
        try {
            const { id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem } = req.body;
            const result = await service.updateEmployee(id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);

            return res.status(200).json({
                success: true,
                message: 'Colaborador atualizado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const result = await service.deleteEmployee(id);

            return res.status(200).json({
                success: true,
                message: 'Colaborador deletado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async deleteEmployeeRecord(req, res) {
        try {
            const { id } = req.params;
            const result = await service.deleteEmployeeRecord(id);

            return res.status(200).json({
                success: true,
                message: 'Colaborador deletado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async findRecord(req, res) {
        try {
            const { data, centro_custo } = req.body;
            const result = await service.findRecord(data, centro_custo);

            return res.status(200).json({
                success: true,
                message: 'Registro encontrados com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async createRecord(req, res) {
        try {
            const { ano_mes, dias_uteis, dias_nao_uteis } = req.body;
            const result = await service.createRecord(ano_mes, dias_uteis, dias_nao_uteis);

            return res.status(200).json({
                success: true,
                message: 'Registro do mês criado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async updateRecord(req, res) {
        try {
            const { nome, data, dias_uteis, dias_nao_uteis, reembolso } = req.body;
            const result = await service.updateRecord(nome, data, dias_uteis, dias_nao_uteis, reembolso);

            return res.status(200).json({
                success: true,
                message: 'Registro atualizado com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async donwloadVrTxt(req, res) {
        try {
            const { data, centro_custo } = req.body;
            const { conteudo, nomeArquivo } = await service.generateVrTxt(data, centro_custo);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
            return res.status(200).send(conteudo);
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }

    async donwloadVemTxt(req, res) {
        try {
            const { data, centro_custo } = req.body;
            const { conteudo, nomeArquivo } = await service.generateVemTxt(data, centro_custo);

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
            return res.status(200).send(conteudo);
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }


    async getBenefitMedia(req, res) {
        try {
            const { data, centro_custo } = req.body;
            const result = await service.getBenefitMedia(data, centro_custo);

            return res.status(200).json({
                success: true,
                message: 'Registro encontrados com sucesso.',
                result
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            });
        }
    }
};

export default new BenefitController();