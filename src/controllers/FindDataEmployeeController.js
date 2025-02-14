import FindDataEmployeeService from "../services/FindDataEmployeeService.js";

const service = FindDataEmployeeService;

class FindDataEmployeeController {

    async findDataEmployee(req, res) {
        const { email } = req;

        try {
            const result = await service.findDataEmployee(email);

            return res.status(200).json({
                success: true,
                message: 'Informações do colaborador encontradas.',
                data: result
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new FindDataEmployeeController();