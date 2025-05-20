import xlsx from 'xlsx';

import service from '../services/experience.service.js';

class ExperienceController {
    async getExperience(req, res) {
        try {
            const records = await service.getExperience();

            return res.status(200).json({
                success: true,
                message: 'Registros encontrados.',
                records
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

    async updateModality(req, res) {
        try {
            const { chapa, viajar, segmento } = req.body;
            const records = await service.updateModality(chapa, viajar, segmento);

            return res.status(200).json({
                success: true,
                message: 'Registros encontrados.',
                records
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

    async convertToExcel(req, res) {
        try {
            const datas = await service.getExperienceData();

            const worksheet = xlsx.utils.json_to_sheet(datas);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Disposition', 'attachment; filename="experiência.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return res.send(buffer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Erro ao gerar o Excel.' });
        }
    }
}

export default new ExperienceController();