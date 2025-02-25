import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import employeeController from "../../../controllers/employee.controller.js";
import employeeService from "../../../services/employee.service.js";
import { validarToken } from "../../../utils/jwt-manager.js";

jest.mock("../../../services/employee.service.js");
jest.mock("../../../utils/jwt-manager.js", () => ({
    validarToken: jest.fn(),
}));

describe("EmployeeController", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("getAllEmployees", () => {
        test("deve retornar todos os colaboradores com sucesso", async () => {
            const mockEmployees = [
                { name: "joao", email: "joao@sameengenharia.com.br" },
                { name: "maria", email: "maria@sameengenharia.com.br" },
            ];

            jest.spyOn(employeeService, "getAllEmployees").mockResolvedValue(mockEmployees);
            await employeeController.getAllEmployees(req, res);

            expect(employeeService.getAllEmployees).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaboradores encontrados com sucesso",
                employees: mockEmployees,
            });
        });

        test("deve retornar erro 401 quando não autorizado", async () => {
            const error = new Error("Não autorizado");
            error.statusCode = 401;

            jest.spyOn(employeeService, "getAllEmployees").mockRejectedValue(error);
            await employeeController.getAllEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Não autorizado",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "getAllEmployees").mockRejectedValue(new Error("Erro interno"));
            await employeeController.getAllEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor.",
            });
        });
    });

    describe("getEmployeeByEmail", () => {
        test("deve retornar um colaborador com sucesso", async () => {
            const mockEmployee = {
                id: 1,
                name: "teste",
                email: "teste@sameengenharia.com.br",
            };

            req.body.email = "teste@sameengenharia.com.br";

            jest.spyOn(employeeService, "getEmployeeByEmail").mockResolvedValue(mockEmployee);
            await employeeController.getEmployeeByEmail(req, res);

            expect(employeeService.getEmployeeByEmail).toHaveBeenCalledWith("teste@sameengenharia.com.br");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador encontrado com sucesso.",
                employee: mockEmployee,
            });
        });

        test("deve retornar erro 400 quando email não for fornecido", async () => {
            const error = new Error("Email é obrigatório");
            error.statusCode = 400;

            jest.spyOn(employeeService, "getEmployeeByEmail").mockRejectedValue(error);
            await employeeController.getEmployeeByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Email é obrigatório",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "getEmployeeByEmail").mockRejectedValue(new Error("Erro interno"));
            await employeeController.getEmployeeByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor.",
            });
        });
    });

    describe("createEmployee", () => {
        beforeEach(() => {
            req.body = {
                name: "Teste",
                email: "teste@sameengenharia.com.br",
                position: "testador",
                role: "testando",
                password: "Teste@123",
            };
        });

        test("deve criar um novo colaborador com sucesso", async () => {
            const mockEmployee = {
                id: 8,
                email: "teste@sameengenharia.com.br",
                name: "Teste",
                position: "testador",
                role: "testando",
            };

            jest.spyOn(employeeService, "createEmployee").mockResolvedValue(mockEmployee);
            await employeeController.createEmployee(req, res);

            expect(employeeService.createEmployee).toHaveBeenCalledWith(
                "Teste",
                "teste@sameengenharia.com.br",
                "testador",
                "testando",
                "Teste@123"
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador criado com sucesso.",
                employee: mockEmployee,
            });
        });

        test("deve retornar erro 409 quando email já estiver em uso", async () => {
            const error = new Error("Email já está em uso");
            error.statusCode = 409;

            jest.spyOn(employeeService, "createEmployee").mockRejectedValue(error);
            await employeeController.createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Email já está em uso",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "createEmployee").mockRejectedValue(new Error("Erro interno"));
            await employeeController.createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor.",
            });
        });
    });

    describe("updateEmployee", () => {
        beforeEach(() => {
            req.body = {
                username: "novousername",
                email: "teste@sameengenharia.com.br",
                currentPassword: "Senha@123",
                newPassword: "NovaSenha@123",
            };
        });

        test("deve atualizar os dados de um colaborador com sucesso", async () => {
            const mockUpdatedEmployee = {
                employee: {
                    id: 1,
                    username: "novousername",
                    email: "teste@sameengenharia.com.br",
                },
            };

            jest.spyOn(employeeService, "updateEmployee").mockResolvedValue(mockUpdatedEmployee);
            await employeeController.updateEmployee(req, res);

            expect(employeeService.updateEmployee).toHaveBeenCalledWith(
                "novousername",
                "teste@sameengenharia.com.br",
                "Senha@123",
                "NovaSenha@123"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador atualizado com sucesso.",
                employee: mockUpdatedEmployee.employee,
            });
        });

        test("deve retornar erro 401 quando senha atual estiver incorreta", async () => {
            const error = new Error("Senha atual incorreta");
            error.statusCode = 401;

            jest.spyOn(employeeService, "updateEmployee").mockRejectedValue(error);
            await employeeController.updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Senha atual incorreta",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "updateEmployee").mockRejectedValue(new Error("Erro interno"));
            await employeeController.updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor.",
            });
        });
    });

    describe("deleteEmployee", () => {
        beforeEach(() => {
            req.body = {
                email: "teste@sameengenharia.com.br",
            };
        });

        test("deve deletar um colaborador com sucesso", async () => {
            const mockEmployee = {
                id: 1,
                email: "teste@sameengenharia.com.br",
                name: "Teste",
            };

            jest.spyOn(employeeService, "deleteEmployee").mockResolvedValue(mockEmployee);
            await employeeController.deleteEmployee(req, res);

            expect(employeeService.deleteEmployee).toHaveBeenCalledWith("teste@sameengenharia.com.br");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador excluido com sucesso.",
                employee: mockEmployee,
            });
        });

        test("deve retornar erro 404 quando colaborador não for encontrado", async () => {
            const error = new Error("Colaborador não encontrado");
            error.statusCode = 404;

            jest.spyOn(employeeService, "deleteEmployee").mockRejectedValue(error);
            await employeeController.deleteEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Colaborador não encontrado",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "deleteEmployee").mockRejectedValue(new Error("Erro interno"));
            await employeeController.deleteEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro no servidor.",
            });
        });
    });

    describe("authenticateEmployee", () => {
        beforeEach(() => {
            req.body = {
                email: "teste@sameengenharia.com.br",
                password: "Senha@123",
            };
        });

        test("deve autenticar um colaborador com sucesso", async () => {
            const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

            jest.spyOn(employeeService, "authenticateEmployee").mockResolvedValue(mockToken);
            await employeeController.authenticateEmployee(req, res);

            expect(employeeService.authenticateEmployee).toHaveBeenCalledWith(
                "teste@sameengenharia.com.br",
                "Senha@123"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Colaborador logado com sucesso.",
                token: mockToken,
            });
        });

        test("deve retornar erro 401 quando credenciais forem inválidas", async () => {
            const error = new Error("Credenciais inválidas");
            error.statusCode = 401;

            jest.spyOn(employeeService, "authenticateEmployee").mockRejectedValue(error);
            await employeeController.authenticateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Credenciais inválidas",
            });
        });

        test("deve retornar erro 500 quando houver falha interna", async () => {
            jest.spyOn(employeeService, "authenticateEmployee").mockRejectedValue(new Error("Erro interno"));
            await employeeController.authenticateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro interno no servidor.",
            });
        });
    });

    describe("validateEmployeeToken", () => {
        beforeEach(() => {
            req.headers = {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            };
        });
    
        test("deve validar o token do colaborador com sucesso", async () => {
            const mockResult = {
                email: "teste@sameengenharia.com.br",
                iat: "1740398614",
                exp: "1740402214",
            };
    
            validarToken.mockResolvedValue(mockResult);
            await employeeController.validateEmployeeToken(req, res);
    
            expect(validarToken).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Token Válido.",
                result: mockResult,
            });
        });
    
        test("deve retornar erro 401 quando o token for inválido", async () => {
            validarToken.mockResolvedValue(false);
            await employeeController.validateEmployeeToken(req, res);
    
            expect(validarToken).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Token inválido ou expirado.",
            });
        });
    
        test("deve retornar erro 500 quando houver falha interna", async () => {
            validarToken.mockRejectedValue(new Error("Erro interno"));
            await employeeController.validateEmployeeToken(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Erro interno",
            });
        });
    });
});