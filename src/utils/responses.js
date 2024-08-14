
/**
 * @Author - ViiktorHugo - LIndervalMoura
 * @description - Classe para realizar os retornos de sucesso e erro do controller bicicleta/totem
 */
class Response {
    /**
     * @description - Envia mensagem de sucesso, recebe opcionalmente uma mensagem e algum dado a ser impresso
     */
    static sendSucess(res, mensagem = null, data = null){
        const responseObj = {
            codigo: "200",
        }

        if(mensagem !== null) {
            responseObj.mensagem = mensagem;
        }

        if(data != null) {
            responseObj.data = data;
        }

        res.status(200).json(responseObj);
    };

    static sendNotFound(res, mensagem){
        res.status(200).json({
            codigo: "404",
            mensagem: mensagem
        })
    };

    static sendInvalidData(res,mensagem) {
        res.status(422).json({
            codigo: "422",
            mensagem: mensagem
        })
    }

    static sendServerError(res,mensagem) {
        res.status(500).json({
            codigo: "500",
            mensagem: mensagem,
        })
    }
}

module.exports = Response;