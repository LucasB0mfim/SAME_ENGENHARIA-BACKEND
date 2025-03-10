import repository from '../repositories/employee.repository.js';
import { generateToken, validarToken } from '../utils/jwt-manager.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';

import dotenv from "dotenv";

dotenv.config();


class EmployeeService {
    async getAllEmployees() {
        return await repository.findAll();
    }

    async getEmployeeByEmail(email) {
        if (!email) {
            throw new AppError('Email não fornecido.', 400);
        }

        return await repository.findByEmail(email);
    }

    async getEmployeeByToken(token) {
        if (!token) {
            throw new AppError('Token não fornecido.', 400);
        }

        const isValidToken = await validarToken(token)
        return await repository.findByEmail(isValidToken.email);
    }

    async createEmployee(name, email, position, role, password) {
        if (!name || !email || !position || !role || !password) {
            throw new AppError('Todos os campos são obrigatórios.', 400);
        }

        return await repository.create(name, email, position, role, password);
    }

    async updateEmployee(username, email, currentPassword, newPassword) {
        if (!username || !email || !currentPassword || !newPassword) {
            throw new AppError('Todos os campos são obrigatórios.', 400);
        }

        if (currentPassword !== process.env.SP) {
            throw new AppError('Senha atual incorreta.', 401)
        }

        return await repository.update(username, email, currentPassword, newPassword);
    }

    async deleteEmployee(email) {
        if (!email) {
            throw new AppError('Email não fornecido.', 400);
        }

        return await repository.delete(email);
    }

    async authenticateEmployee(email, password) {
        if (!email || !password) {
            throw new AppError('Email e senha são obrigatórios.', 400);
        }

        try {
            const employee = await repository.findByLogin(email, password);

            if (!employee) {
                throw new AppError('Colaborador não encontrado.', 404);
            }

            const isPasswordValid = await repository.validatePassword(
                password,
                employee.password
            );

            if (!isPasswordValid) {
                throw new AppError('Senha incorreta.', 401);
            }

            return generateToken(email)
        } catch (error) {
            logger.error(`Erro na autenticação do colaborador: ${error.message}`);
            throw error;
        }
    }

    async validateEmployeeToken(token) {
        if (!token) {
            throw new AppError('Token não fornecido.', 400);
        }

        const isValidToken = await validarToken(token);
        if (!isValidToken) {
            throw new AppError('Token inválido ou expirado.', 401);
        }

        return {
            success: true,
            message: 'Token válido.',
            email: isValidToken.email
        };
    }
}

export default new EmployeeService();