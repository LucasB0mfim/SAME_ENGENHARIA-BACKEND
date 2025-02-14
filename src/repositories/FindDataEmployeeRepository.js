import dataBase from '../database/dataBase.js';

class FindDataEmployeeRepository {

    async find(email) {
        const { data, error } = await dataBase
            .from('colaboradores')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            throw new Error('Colaborador não encontrado');
        }

        return data;
    }
}

export default new FindDataEmployeeRepository();