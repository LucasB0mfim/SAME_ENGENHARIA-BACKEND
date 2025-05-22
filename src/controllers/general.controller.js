import service from '../services/general.service.js';

class NoticeController {
    async getNotice(req, res) {
        try {
            const records = await service.getNotice();

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

    async getComment(req, res) {
        try {
            const records = await service.getComment();

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

    async sendComment(req, res) {
        try {
            const { avatar, username, comment } = req.body;
            const records = await service.sendComment(avatar, username, comment);

            return res.status(200).json({
                success: true,
                message: 'Comentário enviado com sucesso.',
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
}

export default new NoticeController();