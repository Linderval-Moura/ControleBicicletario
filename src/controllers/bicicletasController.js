const Bicicleta = require("../models/bicicletaModel");
const Response = require("../utils/responses");
const trancaService = require("../services/trancaService");
const getFuncionarioAPI = require("../apis/getFuncionarioAPI");
const sendEmailAPI = require("../apis/sendEmailAPI");
const TrancaController = require("./trancaController");

/**
 * @Author - ViiktorHugo
 * @description - Controller para as operacoes de bicicleta
 */
class BicicletaController {
    constructor(){
        this.trancaController = new TrancaController();
    }

    /**
     * @description - cadastra uma nova bicicleta
     */
    async cadastrarBicicleta (req, res) {
        try{
            const bData = {
                marca: req.body.marca,
                modelo: req.body.modelo,
                ano: req.body.ano,
                status: req.body.status.toUpperCase(),
            };

            
            if (!bData.marca || !bData.modelo || !bData.ano || !bData.status) {
                return Response.sendInvalidData(res, 'Dados invalidos, todos os dados precisam ser preenchidos');
            };

            if(bData.status !== 'NOVA'){
                return Response.sendInvalidData(res, 'Dados invalidos, status inicial precisa ser NOVA')
            };

            await Bicicleta.create(bData);
            Response.sendSucess(res, 'Dados cadastrados!');
        } catch(error) {
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    }

    async integrarNaRede(req, res){

        const statusBicicletaValidos = ['NOVA', 'EM_REPARO'];
        const statusTrancaValido = ['LIVRE'];
        const novoStatus = 'DISPONIVEL';

        const funcionario = await getFuncionarioAPI(req.body.idFuncionario);

        const bicicletaController = new BicicletaController();

        const bicicleta = await bicicletaController.getBicicleta({params: {id: req.body.idBicicleta}}, res);
        if(!statusBicicletaValidos.includes(bicicleta.status)){
            return Response.sendInvalidData(res, 'Dados inválidos, bicicleta precisa ser NOVA ou EM_REPARO')
        }

        const tranca = await trancaService.getTranca(req.body.idTranca);
        if(!statusTrancaValido.includes(tranca.status)){
            return Response.sendInvalidData(res, 'Dados inválidos, tranca precisa estar LIVRE')
        }

        //await this.trancaController.trancarBicicleta({params:{id: req.body.idBicicleta}}, res); //aguardando implementacao tranca

        await bicicleta.update({status: novoStatus});

        // envio do e-mail
        const registro = {
            date: new Date(),
            trancaId: 'Tranca:' + tranca.id,
            bicicletaId: 'Bicicleta inserida: '+ bicicleta.id
        }

        await sendEmailAPI(funcionario.email, 'Bicicleta integrada na rede de trancas', registro); //checar se o e-mail esta sendo enviado

        Response.sendSucess(res, 'Dados cadastrados!')
    };

    async retirarDaRede(req, res){
        
        const statusBicicletaValido = ['REPARO_SOLICITADO'];
        const statusTrancaValido = ['OCUPADA'];
        const statusValidos = ['APOSENTADA', 'EM_REPARO'];

        const funcionario = await getFuncionarioAPI(req.body.idFuncionario);

        const novoStatus = req.body.novoStatus.toUpperCase();
        if(!statusValidos.includes(novoStatus)){
            return Response.sendInvalidData(res, 'Dado inválido, novo status precisa ser APOSENTADA ou EM_REPARO')
        }
        
        const tranca = await trancaService.getTranca(req.body.idTranca);
        if(!statusTrancaValido.includes(tranca.status)) {
            return Response.sendInvalidData(res, 'Dado inválido, status da tranca precisa ser OCUPADA')
        }

        const bicicleta = await bicicletaController.getBicicleta({params: {id: req.body.idBicicleta}}, res);
        if(!statusBicicletaValido.includes(bicicleta.status)){
            return Response.sendInvalidData(res, 'Dados inválidos, bicicleta precisa estar no status: REPARO_SOLICITADO')
        }
        
        //await this.controllerTranca.destrancarTranca({params: {id: req.body.idBicicleta}},res); //aguardando implementacao de tranca
        
        await bicicleta.update({status: novoStatus});

        //envio do email
        const registro = {
            date: new Date(),
            reparador: 'Reparador: ' + funcionario.id + ', ' + funcionario.nome, 
            bicicletaId: 'Bicicleta removida: '+ bicicleta.id,
            novoStatus: 'O novo status da bicicleta é: ' + bicicleta.status
        }

        const enviodeEmail = await sendEmailAPI(funcionario.email, 'Retirada de bicicleta da rede de trancas', registro); //checar se o e-mail esta sendo enviado
        console.log(enviodeEmail);

        Response.sendSucess(res, 'Dados cadastrados!')
    };

    async listarBicicletas(req, res){
        try {
            const bicicletas = await Bicicleta.findAll({
                order: [['id', 'ASC']]
            });

            return Response.sendSucess(res, null, bicicletas);
        } catch (error) {
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    };

    /**
     * @description - Procura bicicleta a partir do ID.
     */
    async getBicicleta(req, res){
        try{
            const bicicleta = await Bicicleta.findOne({where:{id: req.params.id}});

            if (!bicicleta) {
                return Response.sendNotFound(res, 'Bicicleta nao encontrada!');
            }
            
            Response.sendSucess(res, 'Bicicleta encontrada!', bicicleta.id);
            return bicicleta;
        } catch(error) {
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    };

    async removerBicicleta(req, res){
        try {
            const statusBicicletaValido = 'APOSENTADA';
            const bicicleta = await Bicicleta.findOne({where:{id: req.params.id}});

            if (!bicicleta) {
                return Response.sendNotFound(res, 'Bicicleta nao encontrada!');
            };
            if (!statusBicicletaValido.includes(bicicleta.status)){
                return Response.sendInvalidData(res, 'Dado inválido, status da bicicleta precisa ser APOSENTADA')
            }

            await Bicicleta.destroy({where:{id: req.params.id}});

            Response.sendSucess(res, 'Dados removidos');

        } catch(error) {
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    };

    async editarBicicleta(req, res){
        try {
            const bicicleta = await Bicicleta.findOne({where:{id: req.params.id}});

            if (!bicicleta) {
                return Response.sendNotFound(res, 'Bicicleta nao encontrada!');
            }

            bicicleta.marca = req.body.marca;
            bicicleta.modelo = req.body.modelo;
            bicicleta.ano = req.body.ano;
            bicicleta.status = req.body.status.toUpperCase().replace(/ /g, '_');

            if (!bicicleta.marca ||
                !bicicleta.modelo  ||
                !bicicleta.ano ||
                !bicicleta.status) {
                return Response.sendInvalidData(res, 'Dados invalidos, todos os dados precisam ser preenchidos');
              }

            await bicicleta.save();
            Response.sendSucess(res, 'Dados atualizados!');
        } catch (error){
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    };

    async alterarStatus(req, res){
        try {
            const statusValidos = ['DISPONIVEL', 'EM_USO','NOVA', 'APOSENTADA', 'REPARO_SOLICITADO','EM_REPARO']
            const bicicleta = await Bicicleta.findOne({where:{id: req.params.id}});

            if (!bicicleta) {
                return Response.sendNotFound(res, 'Bicicleta nao encontrada!');
            }

            const novoStatus = req.params.status.toUpperCase();

            if(!statusValidos.includes(novoStatus)) {
                return Response.sendInvalidData(res, 'Status invalido');
            }

            bicicleta.status = req.params.status;

            await bicicleta.save();
            Response.sendSucess(res, 'Ação bem sucedida');
        } catch(error){
            Response.sendServerError(res, 'Erro interno no servidor!');
        }
    };
}

module.exports = BicicletaController;