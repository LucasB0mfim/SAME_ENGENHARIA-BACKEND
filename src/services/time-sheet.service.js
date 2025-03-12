import repository from '../repositories/time-sheet.repository.js';

class TimeSheetsService {
    async getAllRecords() {
        return await repository.findAll();
    }

    async getRecordsByName(name) {
        return await repository.findByName(name);
    }

    async getRecordsByFilters(status, abono, startDate, endDate) {
        return await repository.findByFilters(status, abono, startDate, endDate);
    }
}

export default new TimeSheetsService();