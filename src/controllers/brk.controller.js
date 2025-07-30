import service from "../services/brk.service.js";

class BrkController {

    async findByCC(req, res) {
        try {
            const centro_custo = req.query.centroCusto;
            const result = await service.findByCC(centro_custo);

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

    async findItemsByStatus(req, res) {
        try {
            const centro_custo = req.query.centroCusto;
            const status = req.query.status;

            const result = await service.findItemsByStatus(centro_custo, status);

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
            const { nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc } = req.body;
            await service.create(nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc);

            return res.status(200).json({
                success: true,
                message: 'Colaboradores criado com sucesso!'
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

    async update(req, res) {
        try {
            const { id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc } = req.body;
            await service.update(id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc);

            return res.status(200).json({
                success: true,
                message: 'Colaboradores atualizado com sucesso!'
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

    async delete(req, res) {
        try {
            const { id } = req.params;
            await service.delete(id);

            return res.status(200).json({
                success: true,
                message: 'Colaborador deletado com sucesso!'
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
}

export default new BrkController();