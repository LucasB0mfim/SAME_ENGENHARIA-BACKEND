import FindDataEmployeeRepository from "../repositories/FindDataEmployeeRepository.js";

const repository = FindDataEmployeeRepository;

class FindDataEmployeeService {

    async findDataEmployee(email) {
        try {
            const employeeData = await repository.find(email);
            return {
                name: employeeData.nome,
                username: employeeData.usuario,
                function: employeeData.funcao,
                avatar: employeeData.avatar
            };
        } catch (error) {
            throw new Error('Erro ao buscar informações do colaborador');
        }
    }
}

export default new FindDataEmployeeService();