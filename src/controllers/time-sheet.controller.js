import service from '../services/time-sheet.service.js';

class TimeSheetsController {
    async getAllRecords(req, res) {
        try {
            const records = await service.getAllRecords();

            return res.status(200).json({
                success: true,
                message: 'Registros da folha de ponto encontrados com sucesso.',
                records
            });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            };

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

    async getRecordsByName(req, res) {
        try {
            const { name } = req.body;
            const records = await service.getRecordsByName(name);

            res.status(200).json({
                success: true,
                message: 'Registros encontrados com sucesso.',
                records
            })
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            };

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

    async getRecordsByFilters(req, res) {
        try {
            const { costCenter, status, startDate, endDate } = req.body;
            const records = await service.getRecordsByFilters(costCenter, status, startDate, endDate);

            return res.status(200).json({
                success: true,
                message: 'Registros encontrados com sucesso.',
                records
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

    async uploadTimeSheet(req, res) {
        try {
            const timeSheet = req.file.buffer;
            const result = await service.uploadTimeSheet(timeSheet);

            res.status(200).json({
                success: true,
                message: ' Controle de ponto armazenado.',
                result
            })
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

    async AddExtraDay(req, res) {
        try {
            const timeSheet = req.file.buffer;
            const result = await service.AddExtraDay(timeSheet);

            res.status(200).json({
                success: true,
                message: 'Dia extra armazenado armazenado.',
                result
            })
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

export default new TimeSheetsController();