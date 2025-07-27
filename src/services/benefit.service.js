import AppError from '../utils/errors/AppError.js';

import repository from '../repositories/benefit.repository.js';
import timesheetRepository from '../repositories/time-sheet.repository.js';
import logger from '../utils/logger/winston.js';

class BenefitService {
    async findEmployee() {
        return await repository.findEmployee();
    }

    async createEmployee(nome, chapa, cpf, data_nascimento, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {

        if (!nome || !chapa || !cpf || !data_nascimento || !funcao || !setor || !contrato || !centro_custo || !recebe_integral || vr_caju === null || vr_caju === undefined || vr_vr === null || vr_vr === undefined || vc_caju === null || vc_caju === undefined || vc_vr === null || vc_vr === undefined || vt_caju === null || vt_caju === undefined || vt_vem === null || vt_vem === undefined || !vr_caju_fixo || !vr_vr_fixo || !vc_caju_fixo || !vc_vr_fixo || !vt_caju_fixo || !vt_vem_fixo) {
            throw new AppError('Os campos "nome", "cpf", "data_nascimento,", "funcao", "setor", "contrato", "centro_custo", "recebe_integral", "vr_caju", "vr_vr", "vc_caju", "vc_vr", "vt_caju", "vt_vem", "vr_caju_fixo", "vr_vr_fixo", "vc_caju_fixo", "vc_vr_fixo", "vt_caju_fixo" e "vt_vem_fixo" são obrigatórios.', 400);
        }

        let formattedBirthDate = null;
        if (data_nascimento) {
            try {
                const day = data_nascimento.slice(0, 2);
                const month = data_nascimento.slice(2, 4);
                const year = data_nascimento.slice(4, 8);
                formattedBirthDate = `${year}-${month}-${day}`;

                const date = new Date(formattedBirthDate);
                if (isNaN(date.getTime())) {
                    throw new AppError('Formato de data de nascimento inválido.', 400);
                }
            } catch (error) {
                logger.error('Erro ao formatar birthDate:', error);
                throw new AppError('Formato de data de nascimento inválido.', 400);
            }
        }

        return await repository.createEmployee(nome, chapa, cpf, formattedBirthDate, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo);
    }

    async updateEmployee(id, nome, chapa, cpf, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo) {

        if (!id || !nome || !chapa || !cpf || !funcao || !setor || !contrato || !centro_custo || !recebe_integral || vr_caju === null || vr_caju === undefined || vr_vr === null || vr_vr === undefined || vc_caju === null || vc_caju === undefined || vc_vr === null || vc_vr === undefined || vt_caju === null || vt_caju === undefined || vt_vem === null || vt_vem === undefined || !vr_caju_fixo || !vr_vr_fixo || !vc_caju_fixo || !vc_vr_fixo || !vt_caju_fixo || !vt_vem_fixo) {
            throw new AppError('Os campos "id", "nome", "chapa", "funcao", "setor", "contrato", "centro_custo", "recebe_integral", "vr_caju", "vr_vr", "vc_caju", "vc_vr", "vt_caju", "vt_vem", "vr_caju_fixo", "vr_vr_fixo", "vc_caju_fixo", "vc_vr_fixo", "vt_caju_fixo" e "vt_vem_fixo" são obrigatórios.', 400);
        }

        return await repository.update(id, nome, chapa, cpf, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem, vr_caju_fixo, vr_vr_fixo, vc_caju_fixo, vc_vr_fixo, vt_caju_fixo, vt_vem_fixo);
    }

    async deleteEmployee(id) {

        if (!id) {
            throw new AppError('O campo "id" é obrigatório.', 400);
        }

        return await repository.delete(id);
    }

    async deleteEmployeeRecord(id) {

        if (!id) {
            throw new AppError('O campo "id" é obrigatório.', 400);
        }

        return await repository.deleteRecord(id);
    }

    async createRecord(ano_mes, dias_uteis, dias_nao_uteis) {

        if (!ano_mes || !dias_uteis || !dias_nao_uteis) {
            throw new AppError('Os campos "ano_mes" e "dias_uteis" são obrigatórios.', 400);
        }

        const [year, month] = ano_mes.split('-');
        const data = `${year}-${month}-01`;

        const record = await repository.findEmployee();
        const records = record.map(item => {
            const { id, ...rest } = item;
            return { ...rest, data, dias_uteis, dias_nao_uteis };
        })

        return await repository.createRecord(records);
    }

    async updateRecord(data, nome, reembolso, dias_uteis, dias_nao_uteis, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_caju_fixo, vr_vr, vr_vr_fixo, vc_caju, vc_caju_fixo, vc_vr, vc_vr_fixo, vt_caju, vt_caju_fixo, vt_vem, vt_vem_fixo) {

        if (!data || !nome || reembolso === null || reembolso === undefined || dias_uteis === null || dias_uteis === undefined || dias_nao_uteis === null || dias_nao_uteis === undefined || !funcao || !setor || !contrato || !centro_custo || !recebe_integral || vr_caju === null || vr_caju === undefined || !vr_caju_fixo || vr_vr === null || vr_vr === undefined || !vr_vr_fixo || vc_caju === null || vc_caju === undefined || !vc_caju_fixo || vc_vr === null || vc_vr === undefined || !vc_vr_fixo || vt_caju === null || vt_caju === undefined || !vt_caju_fixo || vt_vem === null || vt_vem === undefined || !vt_vem_fixo) {
            throw new AppError('Os campos "data", "nome", "reembolso", "dias_uteis", "dias_nao_uteis", "funcao", "setor", "contrato", "centro_custo", "recebe_integral", "vr_caju", "vr_caju_fixo", "vr_vr", "vr_vr_fixo", "vc_caju", "vc_caju_fixo", "vc_vr", "vc_vr_fixo", "vt_caju", "vt_caju_fixo", "vt_vem" e "vt_vem_fixo" são obrigatórios.', 400);
        }

        const [year, month] = data.split('-');
        const fullData = `${year}-${month}-01`;
        return await repository.updateRecord(fullData, nome, reembolso, dias_uteis, dias_nao_uteis, funcao, setor, contrato, centro_custo, recebe_integral, vr_caju, vr_caju_fixo, vr_vr, vr_vr_fixo, vc_caju, vc_caju_fixo, vc_vr, vc_vr_fixo, vt_caju, vt_caju_fixo, vt_vem, vt_vem_fixo);
    }

    async deleteMonth(month) {
        if (!month) throw new AppError('O campo "data" é obrigatório.', 400);
        const correctDate = `${month}-01`;
        return await repository.deleteMonth(correctDate);
    }

    async findRecord(data, centro_custo) {
        if (!data) {
            throw new AppError('O campo data é obrigatório.', 400);
        }

        if (data.split('-')[1] < 1 || data.split('-')[1] > 12) {
            throw new AppError('Mês inválido.', 400);
        }

        const CurrentDate = new Date().getFullYear();

        if (data.split('-')[0] < 2025 || data.split('-')[0] > CurrentDate) {
            throw new AppError('Ano inválido.', 400);
        }

        const [year, month] = data.split('-');

        const date = `${year}-${month}-01`;

        const monthNumber = Number(month);

        let lastMonth = '';
        let monthBeforeLast = '';
        let lastYear = year;
        let yearBeforeLast = year;

        if (monthNumber === 1) {
            lastMonth = '12';
            lastYear = (Number(year) - 1).toString();

            monthBeforeLast = '11';
            yearBeforeLast = (Number(year) - 1).toString();
        } else if (monthNumber === 2) {
            lastMonth = '01';
            lastYear = year;

            monthBeforeLast = '12';
            yearBeforeLast = (Number(year) - 1).toString();
        } else {
            lastMonth = (monthNumber - 1).toString().padStart(2, '0');
            monthBeforeLast = (monthNumber - 2).toString().padStart(2, '0');
        }

        const firstMonth = `${yearBeforeLast}-${monthBeforeLast}-22`;
        const secondMonth = `${lastYear}-${lastMonth}-21`;

        const employees = await repository.findRecord(date, centro_custo);
        const timesheets = await timesheetRepository.findByMonth(firstMonth, secondMonth);

        const dataMerge = employees.map((employee) => {
            const timesheet = timesheets.filter((ts) => {
                return ts.nome.trim().toUpperCase() === employee.nome.trim().toUpperCase()
            });

            return { ...employee, timesheet }
        })

        const dataComBeneficios = dataMerge.map((item) => {
            return {
                ...item,
                days_worked: Math.max(0, this.#daysWorked(item)),
                extra_days: Math.max(0, this.#extraDaysCounter(item.timesheet)),
                absences: Math.max(0, this.#absenceCounter(item.timesheet)),
                medical_certificates: Math.max(0, this.#medicalCertificateCounter(item.timesheet)),
                vr_day: Math.max(0, Number(this.#vr_day(item).toFixed(2))),
                vr_month: Math.max(0, Number(this.#vr_month(item).toFixed(2))),
                vc_day: Math.max(0, Number(this.#vc_day(item).toFixed(2))),
                vc_month: Math.max(0, Number(this.#vc_month(item).toFixed(2))),
                vt_day: Math.max(0, Number(this.#vt_day(item).toFixed(2))),
                vt_month: Math.max(0, Number(this.#vt_month(item).toFixed(2))),
                total_benefit: Math.max(0, Number(this.#totalBenefit(item).toFixed(2)))
            };
        });

        // Verifica se os cálculos essenciais estão todos prontos
        const todosCalculados = dataComBeneficios.every(emp =>
            emp.days_worked !== undefined &&
            emp.vr_month !== undefined &&
            emp.total_benefit !== undefined
        );

        if (!todosCalculados) {
            throw new AppError('Os dados ainda estão sendo processados. Tente novamente em instantes.', 503);
        }

        return dataComBeneficios;
    }

    async getBenefitMedia(data, centro_custo) {
        const records = await this.findRecord(data, centro_custo);
        const employeesLenght = records.length;

        const vr_vr = records.reduce((acc, value) => {
            if (value.vr_vr > 0) return acc + value.vr_month + value.reembolso;
            return acc;
        }, 0);

        const vc_vr = records.reduce((acc, value) => {
            if (value.vc_vr > 0) return acc + value.vc_month;
            return acc;
        }, 0);

        const vt_vem = records.reduce((acc, value) => {
            if (value.vt_vem > 0) return acc + value.vt_month;
            return acc;
        }, 0);

        const vr_caju = records.reduce((acc, value) => {
            if (value.vr_caju > 0) return acc + value.vr_month + value.reembolso;
            return acc;
        }, 0);

        const vc_caju = records.reduce((acc, value) => {
            if (value.vc_caju > 0) return acc + value.vc_month;
            return acc;
        }, 0);

        const vt_caju = records.reduce((acc, value) => {
            if (value.vt_caju > 0) return acc + value.vt_month;
            return acc;
        }, 0);

        const total_vr_card = vr_vr + vc_vr;
        const total_caju_card = vr_caju + vc_caju + vt_caju;
        const sum_vr = vr_vr + vr_caju;
        const sum_vc = vc_vr + vc_caju;
        const sum_vt = vt_vem + vt_caju;
        const sum_cards = total_vr_card + total_caju_card;
        const sum_all = total_vr_card + total_caju_card + vt_vem;
        const media_all = sum_all / employeesLenght;
        const media_vr = sum_vr / employeesLenght;
        const media_vt = sum_vt / employeesLenght;

        return {
            employees: employeesLenght,
            vr_caju: vr_caju,
            vr_vr: vr_vr,
            vc_caju: vc_caju,
            vc_vr: vc_vr,
            vt_caju: vt_caju,
            vt_vem: vt_vem,
            sum_vr: sum_vr,
            sum_vc: sum_vc,
            sum_vt: sum_vt,
            total_caju: total_caju_card,
            total_vr: total_vr_card,
            sum_cards: sum_cards,
            sum_all: sum_all,
            media_all: media_all,
            media_vr: media_vr,
            media_vt: media_vt
        }
    }

    async generateVrTxt(data, centro_custo, benefit) {

        if (!data || !centro_custo || !benefit) {
            throw new AppError('O campo "data", "centro_custo" e "benefit" são obrigatórios.', 400);
        }

        const employees = await this.findRecord(data, centro_custo);
        const filename = benefit === 'VR' ? 'layout_vr_vr.txt' : 'layout_vr_vt.txt';
        const cnpj = '23187835000106';

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const DATA_PROCESSAMENTO = `${day}${month}${year}`;

        let row = 1;

        const startRow = this.#posicionarCampos([
            { texto: '00011' + cnpj + 'SAME CONSTRUTORA LTDA', coluna: 1 },
            { texto: this.#padZeros(row++, 9), coluna: 342 }
        ]) + '\n';

        const row1 = this.#posicionarCampos([
            { texto: '10' + cnpj + '01', coluna: 1 },
            { texto: 'Same Construtora ltda', coluna: 47 },
            { texto: 'Rua', coluna: 127 },
            { texto: 'Arthur Lopes', coluna: 147 },
            { texto: '000218B', coluna: 187 },
            { texto: 'Imbiribeira', coluna: 213 },
            { texto: 'Recife', coluna: 243 },
            { texto: 'PE51200180', coluna: 273 },
            { texto: 'Recursos Humanos', coluna: 273 + 'PE51200180'.length },
            { texto: this.#padZeros(row++, 9), coluna: 342 }
        ]) + '\n';

        let employeeInfo = [];
        let employeeValue = [];

        const filteredEmployees = employees.filter((beneficiario) => {
            if (benefit === 'VR') {
                return beneficiario.vr_vr > 0;
            } else if (benefit === 'VT') {
                return beneficiario.vc_vr > 0;
            }
            return false;
        });

        filteredEmployees.forEach((beneficiario) => {
            const cpf = beneficiario.cpf;

            const linhaBeneficiario = this.#posicionarCampos([
                { texto: '30' + cnpj + cpf + '01', coluna: 1 },
                { texto: beneficiario.nome, coluna: 80 },
                { texto: this.#formatedDate(beneficiario.data_nascimento), coluna: 144 },
                { texto: this.#padZeros(row++, 9), coluna: 342 }
            ]) + '\n';

            employeeInfo.push(linhaBeneficiario);
        });

        const division = this.#posicionarCampos([
            { texto: '50' + cnpj + 'MBF' + DATA_PROCESSAMENTO, coluna: 1 },
            { texto: this.#padZeros(row++, 9), coluna: 342 }
        ]) + '\n';

        filteredEmployees.forEach((beneficiario) => {
            const cpf = beneficiario.cpf;
            const valor = benefit === 'VR' ? beneficiario.vr_month + beneficiario.reembolso : beneficiario.vc_month;
            const valorFormatado = this.#padZeros(Math.round(valor * 100), 11);

            const linhaValor = this.#posicionarCampos([
                { texto: '60' + cnpj + 'MBF' + cpf, coluna: 1 },
                { texto: valorFormatado, coluna: 71 },
                { texto: this.#padZeros(row++, 9), coluna: 342 }
            ]) + '\n';

            employeeValue.push(linhaValor);
        });

        const endRow = this.#posicionarCampos([
            { texto: '99' + cnpj, coluna: 1 },
            { texto: this.#padZeros(row++, 9), coluna: 342 }
        ]) + '\n';

        const content = startRow + row1 + employeeInfo.join('') + division + employeeValue.join('') + endRow;

        logger.info(`Layout VR gerado com sucesso: ${filename}`);

        return {
            filename,
            content
        };
    }

    async generateCajuTxt(data, centro_custo, benefit) {

        if (!data || !centro_custo || !benefit) {
            throw new AppError('Os campos "data", "centro_custo", "benefit" são obrigatórios.', 400);
        }

        const employees = await this.findRecord(data, centro_custo);
        const filename = benefit === 'VR' ? 'layout_caju_vr.txt' : 'layout_caju_vt.txt';
        const rows = ['CPF;Matricula (opcional);Valor Fixo em Auxilio Alimentacao;Mobilidade;Valor Fixo em Mobilidade;Cultura;Valor Fixo em Cultura;Saude;Valor Fixo em Saude;Educacao;Valor Fixo em Educacao;Home Office;Valor Fixo em Home Office;Saldo livre;Saldo Multi'];

        const isSpecialCase = (employee) =>
            employee.centro_custo === 'ESCRITÓRIO' ||
            employee.contrato === 'ESTÁGIO' ||
            employee.contrato === 'PJ' ||
            employee.funcao === 'ALMOXARIFE';

        employees.forEach((employee) => {
            const cpf = employee.cpf || '00000000000';
            const vr = employee.vr_caju > 0 ? employee.vr_month + employee.reembolso : 0;
            const bus = employee.vt_caju > 0 ? employee.vt_month : 0;
            const fuel = employee.vc_caju > 0 ? employee.vc_month : 0;
            const vt = bus + fuel;

            if (benefit === 'VR' && vr > 0) {
                if (isSpecialCase(employee)) {
                    rows.push(`${cpf};;0;0;0;0;0;0;0;0;0;0;0;${vr};0`);
                } else {
                    rows.push(`${cpf};;${vr};0;0;0;0;0;0;0;0;0;0;0;0`);
                }
            };

            if (benefit === 'VT' && vt > 0) {
                if (isSpecialCase(employee)) {
                    rows.push(`${cpf};;0;0;0;0;0;0;0;0;0;0;0;${vt};0`);
                } else {
                    rows.push(`${cpf};;${vt};0;0;0;0;0;0;0;0;0;0;0;0`);
                }
            };
        });

        logger.info(`Arquivo ${filename} gerado com sucesso.`);

        return {
            filename,
            content: rows.join('\n')
        };

    }

    async generateVemTxt(data, centro_custo) {

        if (!data || !centro_custo) {
            throw new AppError('Os campos "data" e "centro_custo" são obrigatórios.', 404);
        }

        const employees = await this.findRecord(data, centro_custo);
        const filename = 'layout_vem.txt';
        const rows = ['0200'];

        employees.forEach((employee) => {
            const cpf = employee.cpf || '00000000000';
            const days_worked = employee.days_worked || 0;
            const vt = employee.vt_vem > 0 ? employee.vt_month / days_worked * 100 : 0;
            const name = employee.nome.trim().toUpperCase() || 'N/A';

            if (vt > 0) {
                rows.push(`${cpf}|${days_worked}|${vt}|${name}`);
            }
        });

        logger.info(`Arquivo ${filename} gerado com sucesso.`);

        return {
            filename,
            content: rows.join('\n')
        }
    }

    // ========== MÉTODOS PARA CALCULAR BENEFÍCIOS ========== //

    #vr_month(employee) {
        const vr_day = employee.vr_caju + employee.vr_vr;

        if (employee.vr_caju_fixo === 'SIM' || employee.vr_vr_fixo === 'SIM') {
            return vr_day;
        } else if (employee.recebe_integral === 'SIM') {
            return (vr_day * (employee.dias_uteis + employee.dias_nao_uteis));
        } else {
            return vr_day * this.#daysWorked(employee);
        }
    }

    #vr_day(employee) {
        const vr_month = this.#vr_month(employee);

        if (employee.recebe_integral === 'SIM') {
            return (vr_month / (employee.dias_uteis + employee.dias_nao_uteis));
        } else {
            return vr_month / employee.dias_uteis;
        }
    }


    #vc_month(employee) {
        const vc_day = employee.vc_caju + employee.vc_vr;

        if (employee.vc_caju_fixo === 'SIM' || employee.vc_vr_fixo === 'SIM') {
            return vc_day;
        } else if (employee.recebe_integral === 'SIM') {
            return (vc_day * (employee.dias_uteis + employee.dias_nao_uteis));
        } else {
            return vc_day * this.#daysWorked(employee);
        }
    }

    #vc_day(employee) {
        const vc_month = this.#vc_month(employee);

        if (employee.recebe_integral === 'SIM') {
            return (vc_month / (employee.dias_uteis + employee.dias_nao_uteis));
        } else {
            return vc_month / employee.dias_uteis;
        }
    }

    #vt_month(employee) {
        const vt_day = employee.vt_caju + employee.vt_vem;

        if (employee.vt_caju_fixo === 'SIM' || employee.vt_vem_fixo === 'SIM') {
            return vt_day;
        } else if (employee.recebe_integral === 'SIM') {
            return vt_day * employee.dias_uteis;
        } else {
            return vt_day * this.#daysWorked(employee);
        }
    }

    #vt_day(employee) {
        const vt_month = this.#vt_month(employee);

        if (employee.recebe_integral === 'SIM') {
            return (vt_month / (employee.dias_uteis + employee.dias_nao_uteis));
        } else {
            return vt_month / employee.dias_uteis;
        }
    }

    // ========== MÉTODOS AUXILIARES PARA CALCULAR FALTAS ========== //
    #daysWorked(employee) {
        if (employee.contrato === 'ESTÁGIO' || employee.contrato === 'PJ' || employee.funcao === 'ENCARREGADO') {
            return employee.dias_uteis;
        } else if (employee.recebe_integral === 'SIM') {
            return employee.dias_uteis + employee.dias_nao_uteis - this.#absenceCounter(employee.timesheet) - this.#medicalCertificateCounter(employee.timesheet);
        } else {
            return employee.dias_uteis + this.#extraDaysCounter(employee.timesheet) - this.#absenceCounter(employee.timesheet) - this.#medicalCertificateCounter(employee.timesheet);
        }
    }

    #extraDaysCounter(timesheet) {
        return timesheet.filter(value => value.evento_abono === 'Dia extra').length;
    }

    #absenceCounter(timesheet) {
        const abonosValidos = [
            'NÃO CONSTA',
            'Day-off',
            'Comparecimento em Juízo',
            'Doação de Sangue',
            'AFASTAMENTO INSS',
            'Casamento',
            'Exame Vestibular',
            'Declaração de Horas',
            'Suspensão',
            'Falta injustificada',
            'Licença Paternidade',
            'Falecimento de Parente Próximo'
        ];

        return timesheet.filter(value => {
            const horas = parseInt(value.jornada_realizada?.split(':')[0] || '0');
            return horas < 3 && abonosValidos.includes(value.evento_abono);
        }).length;
    }

    #medicalCertificateCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'Atestado Médico' &&
            parseInt(value.jornada_realizada?.split(':')[0]) < 3 &&
            !this.#isWeekend(value.periodo)
        ).length;
    }

    #isWeekend(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    }

    #totalBenefit(employee) {
        return (this.#vr_month(employee) + this.#vc_month(employee) + this.#vt_month(employee) + employee.reembolso);
    }

    // ========== MÉTODOS AUXILIARES PARA GERAR O LAYOUT DO CAJU ========== //
    #formatedDate(date) {
        const [year, month, day] = date.split("-");
        return `${day}${month}${year}`
    }

    #posicionarCampos(campos) {
        let linha = '';
        let posicaoAtual = 1;
        campos.forEach(({ texto, coluna }) => {
            while (posicaoAtual < coluna) {
                linha += ' ';
                posicaoAtual++;
            }
            linha += texto;
            posicaoAtual += texto.length;
        });
        return linha;
    }

    #padZeros(value, length) {
        return value.toString().padStart(length, '0');
    }
}

export default new BenefitService();
