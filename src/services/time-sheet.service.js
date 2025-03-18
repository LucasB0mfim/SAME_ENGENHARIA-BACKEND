import repository from '../repositories/time-sheet.repository.js';

class TimeSheetsService {
    async getAllRecords() {
        return await repository.findAll();
    }

    async getRecordsByName(name) {
        return await repository.findByName(name);
    }

    async getRecordsByFilters(status, startDate, endDate) {
        return await repository.findByFilters(status, startDate, endDate);
    }
}

export default new TimeSheetsService();