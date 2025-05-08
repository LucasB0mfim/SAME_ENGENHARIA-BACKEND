import service from '../services/benefit.service.js';

class BenefitController {

    async getEmployees(req, res) {
        try {
            const result = await service.getEmployees();

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

    async createRecord(req, res) {
        try {
            const { data, dias_uteis } = req.body;
            const result = await service.createRecord(data, dias_uteis);

            return res.status(200).json({
                success: true,
                message: 'Mês criado com sucesso.',
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
                message: 'Mês criado com sucesso.',
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