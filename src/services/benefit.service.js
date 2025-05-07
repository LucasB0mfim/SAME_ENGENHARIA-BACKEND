import { eachDayOfInterval, isWeekend, parseISO } from 'date-fns';
import repository from '../repositories/benefit.repository.js';
import AppError from '../utils/errors/AppError.js';

const API_KEY = '19453|qr5oUDy2XWjRq3Bf9fdxdwLCPNE7cglm';

class TrackingService {

    async getEmployees() {
        return await repository.findModel();
    }

    async getFullRecord(date) {
        const employees = await repository.findAll();
        const dias_uteis = await this.getBusinessDays(date);
        const fullRecord = employees.map(item => ({ ...item, dias_uteis }));
        return fullRecord;
    }

    async getBusinessDays(date) {
        const [year, month] = date.split('-').map(Number);

        const holidays = await this.getHolidays(year);

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        const allDays = eachDayOfInterval({ start, end });

        const businessDays = allDays.filter(d => {
            const dateStr = d.toISOString().split('T')[0];
            return !isWeekend(d) && !holidays.includes(dateStr);
        });

        return businessDays.length;
    }

    async getHolidays(year) {
        const res = await fetch(`https://api.invertexto.com/v1/holidays/${year}?token=${API_KEY}`);
        const data = await res.json();
        return Object.values(data).map(f => f.date);
    }

    async createRecord(data, dias_uteis) {

        if (!data || !dias_uteis) {
            throw new AppError('Os campos data e dias_uteis são obrigatórios.', 400);
        }

        const modelData = await repository.findModel();

        const fullRecord = modelData.map(record => {
            const { id, ...rest } = record;
            return { ...rest, data, dias_uteis };
        });

        return await repository.create(fullRecord);
    }
}

export default new TrackingService();
