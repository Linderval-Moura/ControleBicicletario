const Totem = require('../models/TotemModel');
const Tranca = require('../models/tranca');
const Messages = require('../utils/messages');
const RelacaoTotemTranca = require('../models/relacaoTotemTranca');
const TrancaService = require('./trancaService');
const criarErro = require("../utils/erro")

class TotemService {
    static INTERNAL_ERROR = { codigo: "500", mensagem: Messages.SERVER_INTERNAL_ERROR };

    
    static async possuiTranca(idTotem, idTranca) {
        try {
            const relacao = await RelacaoTotemTranca.findOne(
                {where: {totem_id: idTotem, tranca_id: idTranca}}
            )

            if (relacao === null) {
                return { failure: { codigo: "404", mensagem: Messages.TRANCA_NAO_PERTENCE} };
            }

            return { success: relacao };
        } catch (erro) {
            return { failure: TotemService.INTERNAL_ERROR };
        }
    }

    static async canAddTranca(idTotem) {
        try {
            // Limite de trancas por totem
            const limiteDeTrancasPorTotem = 20;

            // Obtém a lista de totens e o número de trancas associadas a cada totem
            const totens = await RelacaoTotemTranca.findAll({
                where: {id: idTotem}
            });

            // Verifica se algum totem já atingiu o limite de 20 trancas
            const totemComLimiteExcedido = totens.length >= limiteDeTrancasPorTotem;

            if (totemComLimiteExcedido) {
                return { success: { podeReceberTranca: false } };
            } else {
                return { success: { podeReceberTranca: true } };
            }
        } catch (erro) {
            return { failure: TotemService.INTERNAL_ERROR };
        }
    }

    static async getTotem(idTotem) {
        const totem = await Totem.findOne(
            {
                where: { id: idTotem },
            }
        );
        if (!totem) return { failure: criarErro('404', Messages.TOTEM_NAO_ENCONTRADO) };
        return { success:  totem  };
    }

    static async conectaTotemTranca(idTotem, idTranca){
        const totem = await TotemService.getTotem(idTotem);
        const tranca = await TrancaService.getTranca(idTranca);

        if (!totem.success){
            return {failure: criarErro('404', Messages.TOTEM_NAO_ENCONTRADO)}
        }
        if(!tranca.success){
            return {failure: criarErro('404', Messages.TRANCA_NAO_ENCONTRADA)}
        }

        if(!TotemService.canAddTranca(idTotem)){
            return {failure: criarErro('422', Messages.TOTEM_LOTADO)}
        }

        const data = {
            totem_id: idTotem,
            tranca_id: idTranca
        }

        const criacao = await RelacaoTotemTranca.create(data);
        return { success: data };
    }

    static async removeTotemTranca(idTotem, idTranca){
        const totem = await TotemService.getTotem(idTotem);
        const tranca = await TrancaService.getTranca(idTranca);

        if (!totem.success){
            return {failure: criarErro('404', Messages.TOTEM_NAO_ENCONTRADO)}
        }
        if(!tranca.success){
            return {failure: criarErro('404', Messages.TRANCA_NAO_ENCONTRADA)}
        }

        const data = {
            totem_id: idTotem,
            tranca_id: idTranca
        }

        const remocao = await RelacaoTotemTranca.destroy({
            where: {totem_id: idTotem, tranca_id: idTranca}
        });

        if (remocao > 0) return { success: data };
        return { failure: TotemService.INTERNAL_ERROR };
    }
}

module.exports = TotemService;
