import repository from '../repositories/time-sheet.repository.js';

class TimeSheetsService {
    async getAllRecords() {
        return await repository.findAll();
    }

    async getRecordsByChapa(chapa) {
        return await repository.findByChapa(chapa);
    }

    async getRecordsByPeriod(periodo) {
        return await repository.findByPeriod(periodo);
    }
}

export default new TimeSheetsService();