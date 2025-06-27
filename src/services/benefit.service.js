import AppError from '../utils/errors/AppError.js';

import repository from '../repositories/benefit.repository.js';
import timesheetRepository from '../repositories/time-sheet.repository.js';
import logger from '../utils/logger/winston.js';

class BenefitService {
    async findEmployee() {
        return await repository.findEmployee();
    }

    async createEmployee(nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem) {

        if (!nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "nome", "funcao", "setor", "contrato", "centro_custo" são obrigatórios.', 400);
        }

        return await repository.createEmployee(nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);
    }

    async updateEmployee(id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem) {

        if (!id || !nome || !funcao || !setor || !contrato || !centro_custo) {
            throw new AppError('Os campos "id", "nome", "funcao", "setor", "contrato", "centro_custo" são obrigatórios.', 400);
        }

        return await repository.update(id, nome, funcao, setor, contrato, centro_custo, vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem);
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

    async updateRecord(nome, data, dias_uteis, dias_nao_uteis, reembolso) {

        if (!nome || !data || !dias_uteis || !dias_nao_uteis || !reembolso) {
            throw new AppError('Os campos "nome", "data", "dias_uteis", "dias_nao_uteis" e "reembolso" são obrigatórios.', 400);
        }

        const [year, month] = data.split('-');
        const fullData = `${year}-${month}-01`;
        return await repository.updateRecord(nome, fullData, dias_uteis, dias_nao_uteis, reembolso);
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

        return dataMerge.map((item) => {
            return {
                ...item,
                days_worked: this.#daysWorked(item),
                extra_days: this.#extraDaysCounter(item.timesheet),
                absences: this.#absenceCounter(item.timesheet),
                medical_certificates: this.#medicalCertificateCounter(item.timesheet),
                vr_day: Number(this.#vr_day(item).toFixed(2)),
                vr_month: Number(this.#vr_month(item).toFixed(2)),
                vc_day: Number(this.#vc_day(item).toFixed(2)),
                vc_month: Number(this.#vc_month(item).toFixed(2)),
                vt_day: Number(this.#vt_day(item).toFixed(2)),
                vt_month: Number(this.#vt_month(item).toFixed(2)),
                total_benefit: Number(this.#totalBenefit(item).toFixed(2))
            }
        })
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

    async generateVrTxt(data, centro_custo) {

        if (!data) throw new AppError('O campo "data" é obrigatório.', 400);
        if (!centro_custo) throw new AppError('O campo "centro_custo" é obrigatório.', 400);

        const employeeValue = await this.findRecord(data, centro_custo);

        const employeeData = employeeValue
            .filter((item) => item.vr_vr > 0 || item.vc_vr > 0)
            .map((employee) => {
                return {
                    cpf: String(employee.cpf),
                    nome: employee.nome,
                    data_nascimento: this.#formatedDate(employee.data_nascimento),
                    valor: employee.vr_month + employee.vc_month
                }
            });

        const agora = new Date();

        const dataHora = [
            agora.getDate().toString().padStart(2, '0'),
            (agora.getMonth() + 1).toString().padStart(2, '0'),
            agora.getFullYear(),
            agora.getHours().toString().padStart(2, '0'),
            agora.getMinutes().toString().padStart(2, '0'),
            agora.getSeconds().toString().padStart(2, '0')
        ];

        const nomeArquivo = `23187835000106_${dataHora[0]}${dataHora[1]}${dataHora[2]}${dataHora[3]}${dataHora[4]}${dataHora[5]}.txt`;
        const CNPJ = '23187835000106';
        const DATA_PROCESSAMENTO = dataHora.slice(0, 3).join('');

        let numeroLinha = 1;

        const linha0 = this.#posicionarCampos([
            { texto: '00011' + CNPJ + 'SAME CONSTRUTORA LTDA', coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        const linha1 = this.#posicionarCampos([
            { texto: '10' + CNPJ + '01', coluna: 1 },
            { texto: 'Same Construtora ltda', coluna: 47 },
            { texto: 'Rua', coluna: 127 },
            { texto: 'Arthur Lopes', coluna: 147 },
            { texto: '000218B', coluna: 187 },
            { texto: 'Imbiribeira', coluna: 213 },
            { texto: 'Recife', coluna: 243 },
            { texto: 'PE51200180', coluna: 273 },
            { texto: 'Recursos Humanos', coluna: 273 + 'PE51200180'.length },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        let linhasBeneficiarios = [];
        let linhasValores = [];

        employeeData.forEach((beneficiario) => {
            const cpfFormatado = beneficiario.cpf.replace(/\D/g, '').padStart(11, '0');
            const linhaBeneficiario = this.#posicionarCampos([
                { texto: '30' + CNPJ + cpfFormatado + '01', coluna: 1 },
                { texto: beneficiario.nome, coluna: 80 },
                { texto: beneficiario.data_nascimento.replace(/\D/g, ''), coluna: 144 },
                { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
            ]) + '\n';
            linhasBeneficiarios.push(linhaBeneficiario);
        });

        const linhaSeparacao = this.#posicionarCampos([
            { texto: '50' + CNPJ + 'MBF' + DATA_PROCESSAMENTO, coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        employeeData.forEach((beneficiario) => {
            const cpfFormatado = beneficiario.cpf.replace(/\D/g, '').padStart(11, '0');
            const valorFormatado = this.#padZeros(Math.round(beneficiario.valor * 100), 11);
            const linhaValor = this.#posicionarCampos([
                { texto: '60' + CNPJ + 'MBF' + cpfFormatado, coluna: 1 },
                { texto: valorFormatado, coluna: 71 },
                { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
            ]) + '\n';
            linhasValores.push(linhaValor);
        });

        const linhaFinal = this.#posicionarCampos([
            { texto: '99' + CNPJ, coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        const conteudo = linha0 + linha1 + linhasBeneficiarios.join('') + linhaSeparacao + linhasValores.join('') + linhaFinal;

        logger.info(`Layout VR gerado com sucesso: ${nomeArquivo}`);

        return {
            nomeArquivo,
            conteudo
        };
    }

    async generateVemTxt(data, centro_custo) {

        if (!data) throw new AppError('O campo "data" é obrigatório.', 400);
        if (!centro_custo) throw new AppError('O campo "centro_custo" é obrigatório.', 400);

        const employees = await this.findRecord(data, centro_custo);
        const filteredEmployees = employees.filter(emp => emp.vt_vem > 0);

        const linhas = ['0200'];

        filteredEmployees.forEach(employee => {
            const cpf = String(employee.cpf).replace(/\D/g, '').padStart(11, '0');
            const diasUteis = parseInt(employee.days_worked, 10) || 0;
            const valorDia = Math.round(employee.vt_day * 100);
            const nome = String(employee.nome || '').trim().toUpperCase();

            linhas.push(`${cpf}|${diasUteis}|${valorDia}|${nome}`);
        });

        const conteudo = linhas.join('\n');
        const nomeArquivo = 'layoutVem.txt';

        return {
            nomeArquivo,
            conteudo
        };
    }

    async generateCajuTxt(data, centro_custo) {

        if (!data) throw new AppError('O campo "data" é obrigatório.', 400);
        if (!centro_custo) throw new AppError('O campo "centro_custo" é obrigatório.', 400);

        const employee = await this.findRecord(data, centro_custo);
        const filteredEmployee = employee.filter((item) => item.vr_caju > 0 || item.vc_caju > 0 || item.vt_caju > 0);
        const row = ['CPF;Matricula (opcional);Valor Fixo em Auxilio Alimentacao;Mobilidade;Valor Fixo em Mobilidade;Cultura;Valor Fixo em Cultura;Saude;Valor Fixo em Saude;Educacao;Valor Fixo em Educacao;Home Office;Valor Fixo em Home Office;Saldo livre;Saldo Multi'];

        console.log(filteredEmployee)

        filteredEmployee.forEach(employee => {
            const cpf = String(employee.cpf).replace(/\D/g, '').padStart(11, '0');
            const vr = employee.vr_month;
            const vc = employee.vc_month;
            const vt = employee.vt_month;
            const transport = vt + vc;
            const total = vr + vc + vt

            if (employee.centro_custo === 'ESCRITÓRIO' || employee.centro_custo === 'PLANEJAMENTO' || employee.contrato === 'ESTÁGIO' || employee.funcao === 'ALMOXARIFE') {
                row.push(`${cpf};;0;0;0;0;0;0;0;0;0;0;0;${total};0`);
            } else {
                row.push(`${cpf};;${vr};${transport};0;0;0;0;0;0;0;0;0;0;0`);
            }
        });

        const nameFile = 'layoutCaju.txt';
        const content = row.join('\n');

        return {
            nameFile,
            content
        }
    }

    // ========== MÉTODOS PARA CALCUAR BENEFÍCIOS ========== //
    #vr_day(employee) {
        const vr_day = employee.vr_caju + employee.vr_vr;

        if (vr_day > 100) {
            return vr_day / employee.dias_uteis;
        } else {
            return vr_day;
        }
    }

    #vr_month(employee) {
        const vr_day = employee.vr_caju + employee.vr_vr;

        if (vr_day > 100) {
            return vr_day;
        } else if (vr_day > 25) {
            return vr_day * this.#daysWorked(employee);
        } else {
            return vr_day * this.#daysWorked(employee);
        }
    }

    #vc_day(employee) {
        const vc_day = employee.vc_caju + employee.vc_vr;

        if (vc_day > 100) {
            return vc_day / employee.dias_uteis;
        } else {
            return vc_day;
        }
    }

    #vc_month(employee) {
        const vc_day = employee.vc_caju + employee.vc_vr;

        if (vc_day > 100) {
            return vc_day;
        } else {
            return vc_day * this.#daysWorked(employee);
        }
    }

    #vt_day(employee) {
        const vt_day = employee.vt_caju + employee.vt_vem;

        if (vt_day > 100) {
            return vt_day / employee.dias_uteis;
        } else {
            return vt_day;
        }
    }

    #vt_month(employee) {
        const vt_day = employee.vt_caju + employee.vt_vem;

        if (vt_day > 100) {
            return vt_day;
        } else {
            return vt_day * this.#daysWorked(employee);
        }
    }

    // ========== MÉTODOS AUXILIARES ========== //
    #daysWorked(employee) {
        const vr_day = employee.vr_caju + employee.vr_vr;

        if (employee.contrato === 'ESTÁGIO' || employee.contrato === 'PJ' || employee.centro_custo === 'ESCRITÓRIO') {
            return employee.dias_uteis;
        } else if (vr_day > 25 && vr_day < 50) {
            return employee.dias_uteis + employee.dias_nao_uteis - this.#absenceCounter(employee.timesheet) - this.#medicalCertificateCounter(employee.timesheet);
        } else if (employee.funcao === 'ENCARREGADO') {
            return employee.dias_uteis;
        } else {
            return employee.dias_uteis + this.#extraDaysCounter(employee.timesheet) - this.#absenceCounter(employee.timesheet) - this.#medicalCertificateCounter(employee.timesheet);
        }
    }

    #extraDaysCounter(timesheet) {
        return timesheet.filter(value => value.evento_abono === 'Dia extra').length;
    }

    #absenceCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'NÃO CONSTA' &&
            parseInt(value.jornada_realizada?.split(':')[0]) <= 3
        ).length;
    }

    #medicalCertificateCounter(timesheet) {
        return timesheet.filter(value =>
            value.evento_abono === 'Atestado Médico' &&
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

    // ========== MÉTODOS PARA GERAR TXT ========== //
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
