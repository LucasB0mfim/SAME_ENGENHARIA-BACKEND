import { jest } from '@jest/globals';
import EmployeeRepository from '../../repositories/employee.repository';
import dataBase from '../../database/dataBase';
import cache from '../../utils/cache/redis';

describe('EmployeeRepository', () => {
    let repository;

    beforeEach(() => {
        repository = new EmployeeRepository();
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        await cache.flush();
    });

    describe('findByEmail', () => {
        it('should find an employee by email', async () => {
            const mockEmployee = {
                id: 1,
                email: 'test@example.com',
                username: 'testuser'
            };

            jest.spyOn(dataBase, 'from').mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: mockEmployee })
            }));

            const result = await repository.findByEmail('test@example.com');

            expect(result.success).toBe(true);
            expect(result.employee).toEqual(mockEmployee);
        });

        it('should throw error when employee not found', async () => {
            jest.spyOn(dataBase, 'from').mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null })
            }));

            await expect(repository.findByEmail('notfound@example.com'))
                .rejects
                .toThrow('O colaborador não foi encontrado.');
        });
    });
});