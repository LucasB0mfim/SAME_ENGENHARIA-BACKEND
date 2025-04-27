import service from '../services/ti.service.js';

class TiController {
    async getTicket(req, res) {
        try {
            const tickets = await service.getTickets();

            return res.status(200).json({
                success: true,
                message: 'Tickets encontrados com sucesso.',
                tickets
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

    async createTicket(req, res) {
        try {
            const {description, subject, role, applicant_email} = req.body;
            const ticket = await service.createTicket(description, subject, role, applicant_email);

            return res.status(200).json({
                success: true,
                message: 'Ticket enviado com sucesso.',
                ticket
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
}

export default new TiController()