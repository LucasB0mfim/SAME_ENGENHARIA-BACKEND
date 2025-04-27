import repository from '../repositories/ti.repository.js';

class TiService {
    async getTickets() {
        return await repository.getTickets();
    }

    async createTicket(description, subject, role, applicant_email) {
        return await repository.create(description, subject, role, applicant_email);
    }
}

export default new TiService();