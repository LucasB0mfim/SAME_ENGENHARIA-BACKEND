import bcrypt from 'bcrypt';
import dataBase from '../database/dataBase.js';
import AppError from '../utils/errors/AppError.js';
import logger from '../utils/logger/winston.js';
// import cache from '../utils/cache/redis.js';

class EmployeeRepository {
    constructor() {
        this.SALT_ROUNDS = 10;
    }

    async create(name, email, position, role, password) {
        try {
            logger.info(`Creating new employee with email: ${email}`);

            const existingEmployee = await this.findByEmail(email).catch(() => null);

            if (existingEmployee?.success) {
                logger.warn(`Attempt to create duplicate employee: ${email}`);
                throw new AppError('Já existe um colaborador com este email.', 400);
            }

            const hashedPassword = await this.hashPassword(password);

            const { data: employee, error } = await dataBase
                .from('employees')
                .insert({
                    name,
                    email,
                    position,
                    role,
                    password: hashedPassword,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select('id, email, name, position, role, created_at')
                .single();

            if (!employee || error) {
                logger.error(`Failed to create employee: ${email}`, { error });
                throw new AppError('Não foi possível criar o colaborador.', 500);
            }

            // await cache.set(`employee:${email}`, {
            //     success: true,
            //     message: 'Colaborador encontrado.',
            //     employee
            // });

            logger.info(`Employee created successfully: ${email}`);

            return employee
        } catch (error) {
            logger.error(`Error creating employee: ${error.message}`);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            logger.info(`Procurando colaborador com e-mail: ${email}`);

            // const cachedEmployee = await cache.get(`employee:${email}`);
            // if (cachedEmployee) {
            //     logger.info(`Cache hit for employee: ${email}`);
            //     return cachedEmployee;
            // }

            const { data: employee, error } = await dataBase
                .from('employees')
                .select('*')
                .eq('email', email)
                .single();

            if (!employee || error) {
                logger.error(`Colaborador não encontrado: ${email}`);
                throw new AppError('O colaborador não foi encontrado.', 404);
            }

            // await cache.set(`employee:${email}`, response);

            logger.info(`Colaborador encontrado: ${email}`);

            return employee;
        } catch (error) {
            logger.error(`Erro ao encontrar colaborador: ${error.message}`);
            throw error;
        }
    }

    async findByLogin(email, password) {
        try {
            logger.info(`Autenticando colaborador: ${email}`);

            // const cachedEmployee = await cache.get(`employee:${email}`);
            // if (cachedEmployee) {
            //     logger.info(`Cache hit for employee: ${email}`);
            //     return cachedEmployee;
            // }

            const { data: employee, error } = await dataBase
                .from('employees')
                .select('*')
                .eq('email', email)
                .single();

            if (!employee || error) {
                logger.error(`Colaborador não encontrado: ${email}`);
                throw new AppError('O colaborador não foi encontrado.', 404);
            }

            const isPasswordValid = await this.validatePassword(password, employee.password);

            if (!isPasswordValid) {
                logger.warn(`Senha inválida para o colaborador: ${email}`);
                throw new AppError('Senha incorreta.', 401);
            }

            // await cache.set(`employee:${email}`, response);

            logger.info(`Colaborador encontrado: ${email}`);

            return employee;
        } catch (error) {
            logger.error(`Erro ao encontrar colaborador: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        try {
            logger.info('Buscando todos os colaboradores');

            // const cachedEmployees = await cache.get('employees:all');
            // if (cachedEmployees) {
            //     logger.info('Cache hit for all employees');
            //     return cachedEmployees;
            // }

            const { data: employees, error } = await dataBase
                .from('employees')
                .select('name, email, role, avatar')

            if (!employees || error) {
                logger.error('Falha ao buscar colaboradores', { error });
                throw new AppError('Não foi possível retornar os colaboradores.', 404);
            }

            // await cache.set('employees:all', response, 1800);

            logger.info(`Foram encontrados ${employees.length} colaboradores`);

            return employees;
        } catch (error) {
            logger.error(`Erro ao buscar todos os colaboradores: ${error.message}`);
            throw error;
        }
    }

    async update(username, email, currentPassword, newPassword) {
        try {
            logger.info(`Atualizando colaborador: ${email}`);

            const { data: currentEmployee } = await dataBase
                .from('employees')
                .select('*')
                .eq('email', email)
                .single();

            if (!currentEmployee) {
                logger.error(`Colaborador não encontrado para atualização: ${email}`);
                throw new AppError('Colaborador não encontrado.', 404);
            }

            const isPasswordValid = await this.validatePassword(
                currentPassword,
                currentEmployee.password
            );

            if (!isPasswordValid) {
                logger.warn(`Tentativa de senha inválida para colaborador: ${email}`);
                throw new AppError('Senha atual incorreta.', 401);
            }

            const password = await this.hashPassword(newPassword);

            const updateData = {
                username,
                password,
                updated_at: new Date().toISOString()
            };

            const { data: newEmployee, error } = await dataBase
                .from('employees')
                .update(updateData)
                .eq('email', email)
                .select('username, email');

            if (!newEmployee || error) {
                logger.error(`Falha ao atualizar colaborador: ${email}`, { error });
                throw new AppError(`Não foi possível atualizar o colaborador: ${email}`, 500);
            }

            logger.info(`Colaborador atualizado com sucesso: ${email}`);

            return newEmployee;
        } catch (error) {
            logger.error(`Erro ao atualizar colaborador: ${error.message}`);
            throw error;
        }
    }

    async delete(email) {
        try {
            logger.info(`Excluindo colaborador: ${email}`);

            const { data: employee, error } = await dataBase
                .from('employees')
                .delete()
                .eq('email', email)
                .select('id, email, name');

            if (!employee || error) {
                logger.error(`Colaborador não encontrado para exclusão: ${email}`);
                throw new AppError('Colaborador não encontrado.', 404);
            }

            // await Promise.all([
            //     cache.del(`employee:${email}`),
            //     cache.del('employees:all')
            // ]);

            logger.info(`Colaborador excluído com sucesso: ${email}`);

            return employee;
        } catch (error) {
            logger.error(`Erro ao excluir colaborador: ${error.message}`);
            throw error;
        }
    }

    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, this.SALT_ROUNDS);
        } catch (error) {
            logger.error('Erro ao fazer hash da senha');
            throw new AppError('Erro ao processar a senha.', 500);
        }
    }

    async validatePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            logger.error('Erro ao validar a senha');
            throw new AppError('Erro ao validar a senha.', 500);
        }
    }
}

export default new EmployeeRepository();