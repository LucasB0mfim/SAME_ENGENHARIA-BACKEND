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
            const { nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem } = req.body;
            const result = await service.createEmployee(nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem);

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
            const { id, nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem } = req.body;
            const result = await service.updateEmployee(id, nome, posicao, setor, contrato, centro_custo, vr, vt, vc, vem);

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

    async findRecord(req, res) {
        try {
            const { data } = req.body;
            const result = await service.findRecord(data);

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
            const { ano_mes, dias_uteis } = req.body;
            const result = await service.createRecord(ano_mes, dias_uteis);

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
}

export default new BenefitController();