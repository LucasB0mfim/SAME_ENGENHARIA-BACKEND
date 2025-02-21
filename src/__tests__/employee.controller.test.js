import { beforeEach, describe, expect, jest, test } from "@jest/globals"
import employeeController from "../controllers/employee.controller.js"
import employeeService from "../services/employee.service.js"

jest.mock("../services/employee.service.js")

describe("EmployeeController", () => {
    let res;

    beforeEach(() => {
        jest.clearAllMocks()
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    describe("getAllEmployees", () => {
        test("deve retornar todos os colaboradores com sucesso", async () => {
            const req = {}
            const mockEmployees = [
                { name: "joao", email: "joao@sameengenharia.com.br" },
                { name: "maria", email: "maria@sameengenharia.com.br" }
            ]

            jest.spyOn(employeeService, 'getAllEmployees').mockResolvedValue(mockEmployees);
            await employeeController.getAllEmployees(req, res);

            expect(employeeService.getAllEmployees).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Colaboradores encontrados com sucesso',
                employees: mockEmployees
            })
        })

        test("deve retornar erro 500 quando falhar ao buscar colaboradores", async () => {
            const req = {}
            jest.spyOn(employeeService, 'getAllEmployees').mockRejectedValue(new Error("Erro interno"));

            await employeeController.getAllEmployees(req, res);

            expect(employeeService.getAllEmployees).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erro no servidor.'
            })
        })

        test("deve retornar erro com statusCode específico quando houver", async () => {
            const req = {}
            const error = new Error("Não autorizado")
            error.statusCode = 401

            jest.spyOn(employeeService, 'getAllEmployees').mockRejectedValue(error);

            await employeeController.getAllEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Não autorizado"
            })
        })
    })

    describe("getEmployeeByEmail", () => {
        test("deve retornar um colaborador com sucesso", async () => {
            const req = {
                body: { email: "teste@sameengenharia.com.br" }
            }

            const mockEmployee = {
                id: 1,
                name: "teste",
                username: null,
                position: "Estagiário",
                role: "Desenvolvedor",
                email: "teste@sameengenharia.com.br",
                password: "Teste@123",
                created_at: null,
                updated_at: null,
                avatar: null
            };

            jest.spyOn(employeeService, "getEmployeeByEmail").mockResolvedValue(mockEmployee)
            await employeeController.getEmployeeByEmail(req, res)

            expect(employeeService.getEmployeeByEmail).toHaveBeenCalledWith("teste@sameengenharia.com.br");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Colaborador encontrado com sucesso.',
                employee: mockEmployee
            });
        })

        test("deve retornar erro quando email não for fornecido", async () => {
            const req = { body: {} }

            const error = new Error("Email é obrigatório")
            error.statusCode = 400

            jest.spyOn(employeeService, "getEmployeeByEmail").mockRejectedValue(error)
            await employeeController.getEmployeeByEmail(req, res)

            expect(employeeService.getEmployeeByEmail).toHaveBeenCalledWith(undefined)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email é obrigatório'
            })
        })
    })

    describe("createEmployee", () => {
        const validReq = {
            body: {
                name: 'Teste',
                email: 'teste@sameengenharia.com.br',
                position: 'testador',
                role: 'testando',
                password: 'Teste@123'
            }
        }
    
        test("deve criar um novo colaborador com sucesso", async () => {
            const mockEmployee = {
                id: 8,
                email: "teste@sameengenharia.com.br",
                name: "Teste",
                position: "testador",
                role: "testando",
                created_at: "2025-02-21T16:46:29.753"
            }
    
            jest.spyOn(employeeService, "createEmployee").mockResolvedValue(mockEmployee)
            await employeeController.createEmployee(validReq, res)
    
            expect(employeeService.createEmployee).toHaveBeenCalledWith(
                'Teste',
                'teste@sameengenharia.com.br',
                'testador',
                'testando',
                'Teste@123'
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Colaborador criado com sucesso.',
                employee: mockEmployee
            })
        })
    
        test("deve retornar erro quando email já estiver em uso", async () => {
            const error = new Error("Email já está em uso")
            error.statusCode = 409
    
            jest.spyOn(employeeService, "createEmployee").mockRejectedValue(error)
            await employeeController.createEmployee(validReq, res)
    
            expect(employeeService.createEmployee).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Email já está em uso"
            })
        })
    
        test("deve retornar erro quando campos obrigatórios não forem fornecidos", async () => {
            const error = new Error("Todos os campos são obrigatórios")
            error.statusCode = 400
    
            const invalidReq = {
                body: {
                    name: 'Teste',
                    email: 'teste@sameengenharia.com.br'
                    // position e role faltando
                }
            }
    
            jest.spyOn(employeeService, "createEmployee").mockRejectedValue(error)
            await employeeController.createEmployee(invalidReq, res)
    
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Todos os campos são obrigatórios"
            })
        })
    
        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "createEmployee").mockRejectedValue(new Error("Erro interno"))
            await employeeController.createEmployee(validReq, res)
    
            expect(employeeService.createEmployee).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor."
            })
        })
    })

    describe("updateEmployee", () => {
        const validReq = {
            body: {
                username: "novousername",
                email: "teste@sameengenharia.com.br",
                currentPassword: "Senha@123",
                newPassword: "NovaSenha@123"
            }
        }

        test("deve atualizar os dados de um colaborador com sucesso", async () => {
            const mockUpdatedEmployee = {
                employee: {
                    id: 1,
                    username: "novousername",
                    email: "teste@sameengenharia.com.br",
                    updated_at: "2025-02-21T16:46:29.753"
                }
            }

            jest.spyOn(employeeService, "updateEmployee").mockResolvedValue(mockUpdatedEmployee)
            await employeeController.updateEmployee(validReq, res)

            expect(employeeService.updateEmployee).toHaveBeenCalledWith(
                "novousername",
                "teste@sameengenharia.com.br",
                "Senha@123",
                "NovaSenha@123"
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Colaborador atualizado com sucesso.',
                employee: mockUpdatedEmployee.employee
            })
        })

        test("deve retornar erro específico quando senha atual estiver incorreta", async () => {
            const error = new Error("Senha atual incorreta")
            error.statusCode = 401

            jest.spyOn(employeeService, "updateEmployee").mockRejectedValue(error)
            await employeeController.updateEmployee(validReq, res)

            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Senha atual incorreta"
            })
        })
    })

    describe("deleteEmployee", () => {
        test("deve deletar um colaborador com sucesso", async () => {
            const req = {
                body: { email: "teste@sameengenharia.com.br" }
            }

            const mockEmployee = {
                id: 1,
                email: "teste@sameengenharia.com.br",
                name: "Teste"
            }

            jest.spyOn(employeeService, "deleteEmployee").mockResolvedValue(mockEmployee)
            await employeeController.deleteEmployee(req, res)

            expect(employeeService.deleteEmployee).toHaveBeenCalledWith("teste@sameengenharia.com.br")
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador excluido com sucesso.",
                employee: mockEmployee
            })
        })

        test("deve retornar erro ao tentar deletar um colaborador inexistente", async () => {
            const req = {
                body: { email: "teste@sameengenharia.com.br" }
            }

            const error = new Error("Colaborador não encontrado")
            error.statusCode = 404

            jest.spyOn(employeeService, "deleteEmployee").mockRejectedValue(error)
            await employeeController.deleteEmployee(req, res)

            expect(employeeService.deleteEmployee).toHaveBeenCalledWith("teste@sameengenharia.com.br")
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Colaborador não encontrado"
            })
        })

        test("deve retornar erro 500 quando houver falha ao deletar", async () => {
            const req = {
                body: { email: "teste@sameengenharia.com.br" }
            }

            jest.spyOn(employeeService, "deleteEmployee").mockRejectedValue(new Error("Erro interno"))
            await employeeController.deleteEmployee(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor."
            })
        })
    })
})