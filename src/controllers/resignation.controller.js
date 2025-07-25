import service from "../services/resignation.service.js";

class ResignationController {

    async findAll(req, res) {
        try {
            const result = await service.findAll();

            return res.status(200).json({
                success: true,
                message: 'Consulta realizada com sucesso.',
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

    async create(req, res) {
        try {

            const { nome, funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao } = req.body;
            await service.create(nome, funcao, centro_custo, status, modalidade, data_comunicacao, data_solicitacao, observacao);

            return res.status(200).json({
                success: true,
                message: 'Solicitação de demissão criado com sucesso.'
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

    async update(req, res) {
        try {

            const { id, status, modalidade, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado } = req.body;
            await service.update(id, status, modalidade, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado);

            return res.status(200).json({
                success: true,
                message: 'Atualização realizada com sucesso.'
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

    async delete(req, res) {
        try {
            const { id } = req.params;
            await service.delete(id);

            return res.status(200).json({
                success: true,
                message: 'Registro deletado com sucesso!'
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
            })
        }
    }
}

export default new ResignationController()