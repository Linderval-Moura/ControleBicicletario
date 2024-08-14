const Tranca = require('../models/tranca.js');
const Messages = require('../utils/messages.js');
const Bicicleta = require('../models/bicicletaModel.js');
const Totem = require('../models/TotemModel.js');
const criarErro = require('../utils/erro.js');
const ENUM = require('../utils/trancaStatus.js');

class TrancaService {
    static INTERNAL_ERROR = { codigo: "500", mensagem: Messages.SERVER_INTERNAL_ERROR };

    /**
     * Cria uma nova tranca
     * @param {*} numero 
     * @param {*} localizacao 
     * @param {*} ano_de_fabricacao 
     * @param {*} modelo 
     * @param {*} status 
     * @returns objeto contendo uma nova tranca ou contendo um objeto erro como descrito no schema
     */
    static async create(trancaData) {
        try {
            const novaTranca = await Tranca.create(trancaData);
            return { success: novaTranca };
        } catch (erro) {
            return { failure: TrancaService.INTERNAL_ERROR };
        }
    }

    static async getTrancas() {
        try {
            const trancas = await Tranca.findAll()
            return { success: trancas };
        } catch (erro) {
            return { failure: TrancaService.INTERNAL_ERROR };
        }
    }

    static async getTranca(idTranca) {
        try {
            const tranca = await Tranca.findOne({
                where: {
                    id: idTranca
                }
            });

            if (!tranca) return { failure: { codigo: "404", mensagem: Messages.GET_TRANCA_ID_404 } };
            return { success: tranca };
        } catch (erro) { return { failure: TrancaService.INTERNAL_ERROR } }
    }

    static async updateTranca(idTranca, numero, localizacao, ano_de_fabricacao, modelo, status) {
        await Tranca.update(
            {
                ...(numero && { numero: numero }),
                ...(localizacao && {localizacao: localizacao }),
                ...(ano_de_fabricacao && {ano_de_fabricacao: ano_de_fabricacao }),
                ...(modelo && {modelo: modelo }),
                ...(status && {status: status }),
            },
            {
                where: { id: idTranca },
            }
        );
    }

    static async deleteTranca(idTranca) {
        await Tranca.destroy({
            where: {
                id: idTranca,
            }
        });
    }

    static async changeStatus(idTranca, newStatus) {
        if (!newStatus) return {
            failure: {
                codigo: "422",
                mensagem: Messages.POST_TRANCA_STATUS_422
            }
        }
        if (!(newStatus in ENUM)) {
            return {
                failure: criarErro("404",Messages.POST_TRANCA_STATUS_404),
            };
        }
        await Tranca.update(
            {
                status: newStatus,
            },
            {
                where: { id: idTranca },
            }
        );
        return {
            success: { codigo: '200', mensagem: Messages.POST_TRANCA_STATUS_200 },
        }
    }

    static async isLivre(tranca) {
        return tranca.success.status === TrancaService.STATUS_ENUM.LIVRE;
    }

    static async addBicicleta(idTranca, idBicicleta) {
        const bicicleta = await Bicicleta.findOne({ where: { id: idBicicleta } });
        if (bicicleta === null) return { success: { codigo: '200', message: "" }};
        if (bicicleta.status !== ENUM.EM_USO) return { failure: criarErro('422', Messages.BICICLETA_EM_USO) };
        await Bicicleta.update(
            {
                status: "DISPONIVEL",
            },
            {
                where: { id: idBicicleta },
            }
        );
        await Tranca.update(
            {
                bicicleta: idBicicleta,
            },
            {
                where: { id: idTranca }
            }
        );
        return { success: { codigo: '200', message: "" }};
    }

    static async removeBicicleta(tranca) {
        const bicicleta = await Bicicleta.findOne({ where: { id: tranca.bicicleta } });
        if (!bicicleta) return { failure: criarErro('404', Messages.BICICLETA_NAO_ENCONTRADA) };
        await Tranca.update(
            {
                bicicleta: null,
            },
            {
                where: { id: tranca.id },
            }
        );
        await Bicicleta.update(
            {
                status: ENUM.EM_USO,
            },
            {
                where: { id: bicicleta.id },
            }
        );
        return { success: { codigo: '200', mensagem: "" } };
    }
}

module.exports = TrancaService;