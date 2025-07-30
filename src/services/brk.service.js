import repository from "../repositories/brk.repository.js";
import AppError from "../utils/errors/AppError.js";

class BrkService {

    async findByCC(centro_custo) {
        if (!centro_custo) throw new AppError('O campo "centro_custo" é obrigatório.', 400);
        return await repository.findByCC(centro_custo);
    }

    async findItemsByStatus(centro_custo, status) {
        if (!centro_custo || !status) throw new AppError('Os campos "centro_custo" e "status" são obrigatórios.', 400);
        return await repository.findItemsByStatus(centro_custo, status);
    }

    async create(nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        return await repository.create(nome.toUpperCase(), funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc)
    }

    async update(id, nome, funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc) {
        return await repository.update(id, nome.toUpperCase(), funcao, protocolo, contrato, centro_custo, status, dt_envio_pesq_social, dt_prev_aprov_pesq_social, treinamento, ficha_epi, dt_envio_doc, dt_prev_aprov_doc, os, aso, dt_reenvio_doc, dt_prev_aprov_reenvio_doc)
    }

    async delete(id) {
        if (!id) throw new AppError('O campo "id" é obrigatório.', 400);
        return await repository.delete(id);
    }
}

export default new BrkService();