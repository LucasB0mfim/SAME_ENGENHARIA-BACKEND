import { Readable } from 'stream';
import csvParser from 'csv-parser';

import repository from '../repositories/time-sheet.repository.js';
import AppError from '../utils/errors/AppError.js';

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

    async uploadTimeSheet(timeSheet) {

        if (!timeSheet) throw new AppError('O controle de ponto não foi fornecido.');

        const result = [];
        const stream = Readable.from(timeSheet.toString().replace(/^\uFEFF/, ''));

        new Promise((resolve, reject) => {
            stream.pipe(csvParser({ separator: ';' }))
                .on('data', (data) => {

                    const removeSpace = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key.trim(), value.trim()])
                    )

                    const headers = {
                        "PERIODO": removeSpace["Período"].split(" - ")[0],
                        "CHAPA": removeSpace["Matrícula"] === "-" ? null : removeSpace["Matrícula"],
                        "NOME": removeSpace["Nome"],
                        "JORNADA REALIZADA": removeSpace["Jornada realizada"],
                        "FALTA": removeSpace["Falta"] || "NÃO CONSTA",
                        "EVENTO ABONO": removeSpace["Evento Abono"] || "NÃO CONSTA",
                    }

                    result.push(headers)
                })
                .on('end', () => resolve(result))
                .on('error', (error) => reject(error))
        })

        return await repository.create(result);
    }
}

export default new TimeSheetsService();