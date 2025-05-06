import { eachDayOfInterval, isWeekend, parseISO } from 'date-fns';
import repository from '../repositories/benefit.repository.js';

const API_KEY = '19453|qr5oUDy2XWjRq3Bf9fdxdwLCPNE7cglm';

class TrackingService {

    async getEmployees() {
        return await repository.findAll();
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
}

export default new TrackingService();
