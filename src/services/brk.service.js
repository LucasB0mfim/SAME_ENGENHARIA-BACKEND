import repository from "../repositories/brk.repository.js";
import AppError from "../utils/errors/AppError.js";

class BrkService {

    async findAll() {
        return await repository.findAll();
    }

    async findByStatus(status) {
        if (!status) throw new AppError('O campo "status" é obrigatório.', 400);
        return await repository.findByStatus(status);
    }

    async update(id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        return await repository.update(id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc)
    }

    async create(nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        return await repository.create(nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc)
    }
}

export default new BrkService();