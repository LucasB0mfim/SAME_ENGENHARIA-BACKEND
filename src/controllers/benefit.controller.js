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

    async findAllCostCenter(req, res) {
        try {
            const result = await service.findAllCostCenter();

            return res.status(200).json({
                success: true,
                message: 'Centro de custos encontrados com sucesso.',
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

    async findByCostCenter(req, res) {
        try {
            const { centro_custo } = req.body;
            const result = await service.findByCostCenter(centro_custo);

            return res.status(200).json({
                success: true,
                message: 'Colaboradores encontrados com sucesso.',
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

    async updateCostCenter(req, res) {
        try {
            const { id, nome, centro_custo } = req.body;
            const result = await service.updateCostCenter(id, nome, centro_custo);

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

    async createEmployee(req, res) {
        try {
            const { nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo } = req.body;
            const result = await service.createEmployee(nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo);

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
            const { id, chapa, cpf, nome, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo } = req.body;
            const result = await service.updateEmployee(id, nome, chapa, cpf, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo);

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
            const { data, nome, reembolso, dias_uteis, dias_nao_uteis, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_caju_fixo, vr_vr, vr_vr_fixo, vc_caju, vc_caju_fixo, vc_vr, vc_vr_fixo, vt_caju, vt_caju_fixo, vt_vem, vt_vem_fixo } = req.body;
            const result = await service.updateRecord(data, nome, reembolso, dias_uteis, dias_nao_uteis, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_caju_fixo, vr_vr, vr_vr_fixo, vc_caju, vc_caju_fixo, vc_vr, vc_vr_fixo, vt_caju, vt_caju_fixo, vt_vem, vt_vem_fixo);

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

    async deleteMonth(req, res) {
        try {
            const { month } = req.params;
            const result = await service.deleteMonth(month);

            return res.status(200).json({
                success: true,
                message: 'Mês deletado com sucesso.',
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

    async downloadLayoutVr(req, res) {
        try {
            const { data, centro_custo, benefit } = req.body;
            const { content, filename } = await service.generateVrTxt(data, centro_custo, benefit);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.status(200).send(content);
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

    async downloadLayoutVem(req, res) {
        try {
            const { data, centro_custo } = req.body;
            const { content, filename } = await service.generateVemTxt(data, centro_custo);

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.status(200).send(content);
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

    async downloadLayoutCaju(req, res) {
        try {
            const { data, centro_custo, benefit } = req.body;
            const { content, filename } = await service.generateCajuTxt(data, centro_custo, benefit);

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.status(200).send(content);
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