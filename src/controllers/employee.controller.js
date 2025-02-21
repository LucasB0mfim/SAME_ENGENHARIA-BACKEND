import service from '../services/employee.service.js';
import { validarToken } from '../utils/jwt-manager.js';

class EmployeeController {
    async getAllEmployees(req, res) {
        try {
            const employees = await service.getAllEmployees();

            return res.status(200).json({
                success: true,
                message: 'Colaboradores encontrados com sucesso',
                employees
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

    async getEmployeeByEmail(req, res) {
        try {
            const { email } = req.body;
            const employee = await service.getEmployeeByEmail(email);

            return res.status(200).json({
                success: true,
                message: 'Colaborador encontrado com sucesso.',
                employee
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
            const { name, email, position, role, password } = req.body;
            const employee = await service.createEmployee(name, email, position, role, password);
            
            return res.status(201).json({
                success: true,
                message: 'Colaborador criado com sucesso.',
                employee
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
            const { username, email, currentPassword, newPassword } = req.body
            const { employee } = await service.updateEmployee(username, email, currentPassword, newPassword)
            
            return res.status(200).json({
                success: true,
                message: 'Colaborador atualizado com sucesso.',
                employee
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                })
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            })
        }
    }

    async deleteEmployee(req, res) {
        try {
            const { email } = req.body;
            const employee = await service.deleteEmployee(email);
            
            return res.status(200).json({
                success: true,
                message: 'Colaborador excluido com sucesso.',
                employee
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                })
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro no servidor.'
            })
        }
    }

    async authenticateEmployee(req, res) {
        try {
            const { email, password } = req.body;
            const token = await service.authenticateEmployee(email, password);
            
            return res.status(200).json({
                success: true,
                message: 'Colaborador logado com sucesso.',
                token
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

    async validateEmployeeToken(req, res) {
        try {
            const { token } = req.body;
            const result = await validarToken(token);
    
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido ou expirado.'
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Token Válido.',
                result
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new EmployeeController();