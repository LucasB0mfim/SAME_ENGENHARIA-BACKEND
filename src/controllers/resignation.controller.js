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

    async findByStatus(req, res) {
        try {
            const { status } = req.params;

            const result = await service.findByStatus(status);

            return res.status(200).json({
                success: true,
                message: 'Colaboradores encontrados com sucesso!',
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
                message: 'Erro interno no servidor.'
            });
        }
    }

    async create(req, res) {
        try {

            const { nome, status, modalidade, data_comunicacao, data_solicitacao, observacao } = req.body;
            await service.create(nome, status, modalidade, data_comunicacao, data_solicitacao, observacao);

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

            const { id, nome, status, modalidade, data_inicio_aviso_trabalhado, colaborador_comunicado, data_rescisao } = req.body;
            await service.update(id, nome, status, modalidade, data_inicio_aviso_trabalhado, colaborador_comunicado, data_rescisao);

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