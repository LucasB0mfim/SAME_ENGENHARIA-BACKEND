import AppError from '../utils/errors/AppError.js';

import repository from '../repositories/benefit.repository.js';
import timesheetRepository from '../repositories/time-sheet.repository.js';

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

    async createRecord(ano_mes, dias_uteis, dias_nao_uteis) {

        if (!ano_mes || !dias_uteis || !dias_nao_uteis) {
            throw new AppError('Os campos "ano_mes" e "dias_uteis" são obrigatórios.', 400);
        }

        const [year, month] = ano_mes.split('-');
        const data = `${year}-${month}-01`;

        const record = await repository.findEmployee();
        const records = record.map(item => {
            const { id, cpf, data_nascimento, ...rest } = item;
            return { ...rest, data, dias_uteis, dias_nao_uteis };
        })

        return await repository.createRecord(records);
    }

    async updateRecord(nome, data, dias_uteis, dias_nao_uteis) {

        if (!nome || !data || !dias_uteis || !dias_nao_uteis) {
            throw new AppError('Os campos "nome", "data", "dias_uteis" e "dias_nao_uteis" são obrigatórios.', 400);
        }

        const [year, month] = data.split('-');
        const fullData = `${year}-${month}-01`;
        return await repository.updateRecord(nome, fullData, dias_uteis, dias_nao_uteis);
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

        const firstMonth = `${yearBeforeLast}-${monthBeforeLast}-16`;
        const secondMonth = `${lastYear}-${lastMonth}-15`;

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
                vr_day: this.#vr_day(item),
                vr_month: this.#vr_month(item),
                vc_day: this.#vc_day(item),
                vc_month: this.#vc_month(item),
                vt_day: this.#vt_day(item),
                vt_month: this.#vt_month(item),
                total_benefit: this.#totalBenefit(item)
            }
        })
    }

    async getBenefitMedia(data, centro_custo) {
        const records = await this.findRecord(data, centro_custo);
        const employees = records.length;

        // Inicializa totais
        let total_caju = 0;
        let vr_caju_total = 0;
        let vc_caju_total = 0;
        let vt_caju_total = 0;

        let total_vr = 0;  // Soma exata como no TXT
        let vr_vr_total = 0;
        let vc_vr_total = 0;
        let vt_vem_total = 0;

        // Para cálculo das médias
        let total_geral = 0;
        let total_txt_mbf = 0;

        for (const employee of records) {
            // Calcula valores individuais
            const vrCajuMonth = this.#vr_caju_month(employee);
            const vcCajuMonth = this.#vc_caju_month(employee);
            const vtCajuMonth = this.#vt_caju_month(employee);

            const vrVrMonth = this.#vr_vr_month(employee);
            const vcVrMonth = this.#vc_vr_month(employee);
            const vtVemMonth = this.#vt_vem_month(employee);

            // Soma para totais CAJU (todos os funcionários)
            vr_caju_total += vrCajuMonth;
            vc_caju_total += vcCajuMonth;
            vt_caju_total += vtCajuMonth;
            total_caju += vrCajuMonth + vcCajuMonth + vtCajuMonth;

            // Soma para totais VR (apenas funcionários com vr_vr > 0, como no TXT)
            if (employee.vr_vr > 0) {
                const vrMonth = this.#vr_month(employee);
                const vcMonth = this.#vc_month(employee);
                const valorVR = Math.round((vrMonth + vcMonth) * 100) / 100;

                total_vr += valorVR;
                total_txt_mbf += valorVR;

                // Atualiza totais VR/VC separadamente (opcional, se necessário para relatórios)
                vr_vr_total += vrVrMonth;
                vc_vr_total += vcVrMonth;
            }

            // Soma VT VEM (todos os funcionários)
            vt_vem_total += vtVemMonth;

            // Total geral (todos os benefícios de todos os funcionários)
            total_geral += vrCajuMonth + vcCajuMonth + vtCajuMonth +
                vrVrMonth + vcVrMonth + vtVemMonth;
        }

        // Cálculo das médias
        const total_media = employees > 0 ? total_geral / employees : 0;
        const vr_media = employees > 0 ? (vr_caju_total + vr_vr_total) / employees : 0;
        const vt_media = employees > 0 ? (vt_caju_total + vt_vem_total) / employees : 0;

        return {
            total_caju: Number(total_caju.toFixed(2)),
            vr_caju_total: Number(vr_caju_total.toFixed(2)),
            vc_caju_total: Number(vc_caju_total.toFixed(2)),
            vt_caju_total: Number(vt_caju_total.toFixed(2)),
            total_vr: Number(total_vr.toFixed(2)),  // Valor que deve bater com o TXT
            vr_vr_total: Number(vr_vr_total.toFixed(2)),
            vc_vr_total: Number(vc_vr_total.toFixed(2)),
            vt_vem_total: Number(vt_vem_total.toFixed(2)),
            total_geral: Number(total_geral.toFixed(2)),
            total_media: total_media.toFixed(2),
            vr_media: Number(vr_media.toFixed(2)),
            vt_media: Number(vt_media.toFixed(2)),
            total_txt_mbf: Number(total_txt_mbf.toFixed(2)),  // Deve ser igual a total_vr
            employees
        };
    }

    async generateVrTxt(data) {

        if (!data) {
            throw new AppError('O campo "data" é obrigatório.', 400);
        }

        const employeeCPF = await this.findEmployee();
        const employeeValue = await this.findRecord(data, null);

        // Mapear beneficiários, filtrando por vr_vr > 0
        const beneficiarios = employeeValue
            .filter((item) => item.vr_vr && item.vr_vr > 0).map((employee) => {

                if (!employee.nome) {
                    return null;
                }

                const employeeData = employeeCPF.find((item) => {
                    return item.nome && employee.nome && item.nome.trim().toUpperCase() === employee.nome.trim().toUpperCase();
                });

                if (!employeeData) {
                    return null;
                }

                return {
                    cpf: String(employeeData.cpf) || 'N/A',
                    nome: employee.nome || 'N/A',
                    data_nascimento: this.#formatedDate(employeeData.data_nascimento) || 'N/A',
                    valor: this.#calculateVR(employee.vr_month, employee.vc_month) || 0
                };
            }).filter(item => item !== null);

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

        // Linha 0 - Cabeçalho da empresa
        const linha0 = this.#posicionarCampos([
            { texto: '00011' + CNPJ + 'SAME CONSTRUTORA LTDA', coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        // Linha 1 - Endereço da empresa
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

        // Linhas dos beneficiários
        let linhasBeneficiarios = [];
        let linhasValores = [];

        beneficiarios.forEach((beneficiario) => {
            const cpfFormatado = beneficiario.cpf.replace(/\D/g, '').padStart(11, '0');
            const linhaBeneficiario = this.#posicionarCampos([
                { texto: '30' + CNPJ + cpfFormatado + '01', coluna: 1 },
                { texto: beneficiario.nome, coluna: 80 },
                { texto: beneficiario.data_nascimento.replace(/\D/g, ''), coluna: 144 },
                { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
            ]) + '\n';
            linhasBeneficiarios.push(linhaBeneficiario);
        });

        // Linha de separação (código 50)
        const linhaSeparacao = this.#posicionarCampos([
            { texto: '50' + CNPJ + 'MBF' + DATA_PROCESSAMENTO, coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        // Linhas de valores
        beneficiarios.forEach((beneficiario) => {
            const cpfFormatado = beneficiario.cpf.replace(/\D/g, '').padStart(11, '0');
            const valorFormatado = this.#padZeros(Math.round(beneficiario.valor * 100), 11);
            const linhaValor = this.#posicionarCampos([
                { texto: '60' + CNPJ + 'MBF' + cpfFormatado, coluna: 1 },
                { texto: valorFormatado, coluna: 71 },
                { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
            ]) + '\n';
            linhasValores.push(linhaValor);
        });

        // Linha final (código 99)
        const linhaFinal = this.#posicionarCampos([
            { texto: '99' + CNPJ, coluna: 1 },
            { texto: this.#padZeros(numeroLinha++, 9), coluna: 342 }
        ]) + '\n';

        // Juntar todas as linhas
        const conteudo = linha0 + linha1 + linhasBeneficiarios.join('') + linhaSeparacao + linhasValores.join('') + linhaFinal;

        console.log(`Layout VR gerado com sucesso: ${nomeArquivo}`);

        return {
            nomeArquivo,
            conteudo
        };
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
            return Number((vr_day).toFixed(2));
        } else if (vr_day > 25) {
            return Number((vr_day * this.#daysWorked(employee)).toFixed(2));
        } else {
            return Number((vr_day * this.#daysWorked(employee)).toFixed(2));
        }
    }

    #vr_caju_month(employee) {
        const vr_day = employee.vr_caju;

        if (vr_day > 100) {
            return vr_day;
        } else if (vr_day > 25) {
            return vr_day * this.#daysWorked(employee);
        } else {
            return vr_day * this.#daysWorked(employee);
        }
    }

    #vr_vr_month(employee) {
        const vr_day = employee.vr_vr;

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
            return Number((vc_day).toFixed(2));
        } else {
            return Number((vc_day * this.#daysWorked(employee)).toFixed(2));
        }
    }

    #vc_caju_month(employee) {
        const vc_day = employee.vc_caju;

        if (vc_day > 100) {
            return vc_day;
        } else {
            return vc_day * this.#daysWorked(employee);
        }
    }

    #vc_vr_month(employee) {
        const vc_day = employee.vc_vr;

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
            return Number((vt_day).toFixed(2));
        } else {
            return Number((vt_day * this.#daysWorked(employee)).toFixed(2));
        }
    }

    #vt_caju_month(employee) {
        const vt_day = employee.vt_caju;

        if (vt_day > 100) {
            return vt_day;
        } else {
            return vt_day * this.#daysWorked(employee);
        }
    }

    #vt_vem_month(employee) {
        const vt_day = employee.vt_vem;

        if (vt_day > 100) {
            return vt_day;
        } else {
            return vt_day * this.#daysWorked(employee);
        }
    }

    // ========== MÉTODOS AUXILIARES ========== //
    #daysWorked(employee) {
        const vr_day = employee.vr_caju + employee.vr_vr;

        if (employee.contrato === 'ESTÁGIO') {
            return employee.dias_uteis - this.#medicalCertificateCounter(employee.timesheet);
        } else if (vr_day > 25 && vr_day < 50) {
            return employee.dias_uteis + employee.dias_nao_uteis - this.#absenceCounter(employee.timesheet) - this.#medicalCertificateCounter(employee.timesheet);
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
        return Number((this.#vr_month(employee) + this.#vc_month(employee) + this.#vt_month(employee)).toFixed(2));
    }

    // ========== MÉTODOS PARA GERAR TXT ========== //
    #formatedDate(date) {
        const [year, month, day] = date.split("-");
        return `${day}${month}${year}`
    }

    #calculateVR(vr, vc) {
        // Garantir o mesmo arredondamento que no getBenefitMedia
        return Math.round((vr + vc) * 100) / 100;
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
