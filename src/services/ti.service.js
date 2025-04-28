import repository from '../repositories/ti.repository.js';

class TiService {
    async getTickets() {
        return await repository.getTickets();
    }

    async createTicket(description, subject, role, applicant_email) {
        return await repository.create(description, subject, role, applicant_email);
    }

    async updateTicket(id, status, resolution, responsible_technician, closing_date) {
        return await repository.update(id, status, resolution, responsible_technician, closing_date);
    }
}

export default new TiService();