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

            const { centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status } = req.body;
            await service.create(centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status);

            return res.status(200).json({
                success: true,
                message: 'Registro criado com sucesso.'
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

            const { id, centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status } = req.body;
            await service.update(id, centro_custo, colaborador_comunicado, data_demissao, data_inicio_aviso_trabalhado, data_pagamento_rescisao, data_rescisao, data_solicitacao, data_ultimo_dia_trabalhado, funcao, modalidade, nome, observacao, status);

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
}

export default new ResignationController()