import repository from '../repositories/time-sheet.repository.js';

class TimeSheetsService {
    async getAllRecords() {
        return await repository.findAll();
    }

    async getRecordsByName(name) {
        return await repository.findByName(name);
    }

    async getRecordsByPeriod(periodo) {
        return await repository.findByPeriod(periodo);
    }
}

export default new TimeSheetsService();