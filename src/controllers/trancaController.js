
const TrancaService = require('../services/trancaService');
const Messages = require('../utils/messages');
const Bicicleta = require('../models/bicicletaModel');
const getFuncionarioAPI = require("../apis/getFuncionarioAPI");
const sendEmailAPI = require("../apis/sendEmailAPI");
const TotemService = require('../services/totemService')
const ENUM = require('../utils/trancaStatus');
const criarErro = require("../utils/erro");

class TrancaController {
    constructor(){}

    cadastrarTranca = async(request, response) => {
            const { numero, localizacao, ano_de_fabricacao, modelo, status } = request.body;

            if (!numero || !localizacao || !ano_de_fabricacao || !modelo || !status) {
                return criarErro("422",Messages.POST_TRANCA_422);
            }

            const novaTranca = await TrancaService.create({ numero, localizacao, ano_de_fabricacao, modelo, status });

            if (!novaTranca.success) return response.status(500).json(novaTranca.failure);
            return response.status(200).json(novaTranca.success); 
    }

    getTrancas = async(request, response) => {
        const trancas = await TrancaService.getTrancas();
        if (trancas.failure) return response.status(Number(trancas.failure.codigo)).json([trancas.failure]);
        return response.status(200).json([trancas.success]);
    }

    getTrancaByID = async(request, response) => {
        const { idTranca } = request.params;

        const tranca = await TrancaService.getTranca(idTranca);
        if (tranca.failure) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);
        return response.status(200).json([tranca.success]);
    }

    editTranca = async(request, response) => {
        const { idTranca } = request.params;
        const { numero, localizacao, ano_de_fabricacao, modelo, status } = request.body;

        if (!numero || !localizacao || !ano_de_fabricacao || !modelo || !status) {
            return response.status(422).json([{
                codigo: "422",
                mensagem: Messages.PUT_TRANCA_422,
            }]);
        }
        const tranca = await TrancaService.getTranca(idTranca, numero, localizacao, ano_de_fabricacao, modelo, status);
        if (!tranca.success) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);

        await TrancaService.updateTranca(idTranca, numero, localizacao, ano_de_fabricacao, modelo, status);
        const updatedTranca = await TrancaService.getTranca(idTranca);
        if (!updatedTranca.success) {
            return response.status(Number(updatedTranca.failure.codigo)).json([updatedTranca.failure]);
        } return response.status(200).json([updatedTranca.success]);
    }

    removeTranca = async(request, response) => {
        const { idTranca } = request.params;

        const tranca = await TrancaService.getTranca(idTranca);
        if (!tranca.success) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);

        await TrancaService.deleteTranca(idTranca);

        const checaTrancaRemovida = await TrancaService.getTranca(idTranca);
        if (checaTrancaRemovida.success) return response.status(500).json([{codigo: "500", mensagem: Messages.SERVER_INTERNAL_ERROR}]);
        return response.status(200).json();
    }

    getBicicletaFromTranca = async(request, response) => {
        const { idTranca } = request.params;

        const tranca = await TrancaService.getTranca(idTranca);
        if (!tranca.success) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);
        if (!tranca.success.bicicleta) return response.status(200).json([{}]);
        const bicicleta = await Bicicleta.findOne({ where: { id: tranca.success.bicicleta } });
        if (!bicicleta) return response.status(404).json([{ codigo: '404', message: 'Bicicleta nao encontrada!' }]);

        return response.status(200).json([bicicleta]);
    }

    trancarBicicleta = async(request, response) => {
        const { idTranca } = request.params;
        const { bicicleta } = request.body;

        let tranca = await TrancaService.getTranca(idTranca);
        if (!tranca.success) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);
        if (!TrancaService.isLivre(tranca)) return response.status(422).json([{ codigo: '422', message: 'Tranca ocupada' }]);

        await TrancaService.changeStatus(idTranca,ENUM.OCUPADA);
        const addBicicleta = await TrancaService.addBicicleta(idTranca, bicicleta);
        if (addBicicleta.failure) return response.status(Number(addBicicleta.failure.codigo)).json(addBicicleta.failure.message);

        tranca = await TrancaService.getTranca(idTranca);
        return response.status(200).json(tranca.success);
    }

    destrancarTranca = async(request, response) => {
        const { idTranca } = request.params;
        const { bicicleta } = request.body;

        let tranca = await TrancaService.getTranca(idTranca);
        if (!tranca.success) return response.status(Number(tranca.failure.codigo)).json([tranca.failure]);
        if (tranca.success.bicicleta !== bicicleta) return response.status(422).json([criarErro('422', Messages.BICICLETAS_DIFERENTES)]);

        const resultado = await TrancaService.removeBicicleta(tranca.success);
        if (!resultado.success) return response.status(Number(resultado.failure.codigo)).json([resultado.failure]);
        tranca = await TrancaService.getTranca(idTranca);
        return response.status(200).json(tranca.success);
    }

    alterarStatusTranca = async(request, response) => {
        const { idTranca, acao } = request.params;

        const alteredStatus = await TrancaService.changeStatus(idTranca, acao);
        if (!alteredStatus.success) return response.status(Number(alteredStatus.failure.codigo)).json([alteredStatus.failure]);
        return response.status(200).json();
    }

    integrarNaRede = async(request, response) => {

        const novoStatus = ENUM.LIVRE;
        const validTrancaStatuses = [ENUM.NOVA, ENUM.EM_REPARO];
        const { idTotem, idTranca, idFuncionario } = request.body;

        const funcionario = await getFuncionarioAPI(idFuncionario);
        const totem = await TotemService.getTotem(idTotem);
        const tranca = await TrancaService.getTranca(idTranca);

        if (!totem.success) return response.status(Number(totem.failure.codigo)).json([totem.failure]);
        if (!validTrancaStatuses.includes(tranca.success.status)) return request.status(422).json(criarErro('422', Messages.TRANCA_ESTADO_INCOMPATIVEL));
        if (!TotemService.canAddTranca()) return response.status(422).json(criarErro('422', Messages.TOTEM_LOTADO));

        await TrancaService.changeStatus(idTranca, novoStatus);

        await TotemService.conectaTotemTranca(idTotem,idTranca);

        // envio do e-mail
        /* const registro = {
            date: new Date(),
            trancaId: 'Tranca:' + tranca.success.id,
            totemId: 'Totem: '+ totem.success.id,
        }

        await sendEmailAPI(funcionario.email, 'Tranca integrada na rede', registro); */ //checar se o e-mail esta sendo enviado

        return response.status(200).json();
    };

    retirarDaRede = async(request,response) => {
        const validTrancaStatuses = [ENUM.APOSENTADA, ENUM.EM_REPARO];
        const { idTotem, idTranca, idFuncionario, statusAcaoReparador } = request.body;

        const funcionario = await getFuncionarioAPI(idFuncionario);
        const totem = await TotemService.getTotem(idTotem);
        const tranca = await TrancaService.getTranca(idTranca);

        if (!totem.success) return response.status(Number(totem.failure.codigo)).json([totem.failure]);
        if (!tranca.success) return request.status(Number(tranca.failure.codigo)).json([tranca.failure]);
        if (!validTrancaStatuses.includes(statusAcaoReparador)) return response.status(422).json(criarErro('422', Messages.STATUS_INVALIDO));
        if (!TotemService.possuiTranca(idTranca)) return response.status(422).json(criarErro('422', Messages.TRANCA_NAO_PERTENCE));

        const mudouStatus = await TrancaService.changeStatus(idTranca,statusAcaoReparador);
        if (!mudouStatus.success) return response.status(500).json(criarErro('500', Messages.SERVER_INTERNAL_ERROR));

        await TotemService.removeTotemTranca(idTotem, idTranca);

        /* const registro = {
            date: new Date(),
            trancaId: 'Tranca: ' +  tranca.success.id,
            totemId: 'Totem: ' + totem.success.id,
        };

        await sendEmailAPI(funcionario.email, 'Tranca retirada da rede', registro); */

        return response.status(200).json(Messages.DADOS_CADASTRADOS);
    }
}

module.exports = TrancaController;