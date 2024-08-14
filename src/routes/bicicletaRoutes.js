
const express = require('express');
const BicicletaController = require('../controllers/bicicletasController');
/**
 * @Author - ViiktorHugo
 * @description - Rotas dos endpoints de bicicleta
 */
class BicicletaRoutes {
    constructor() {
        this.router = express.Router();
        this.bicicletaController = new BicicletaController();
        this.setupRoutes();
    }

    setupRoutes(){
        this.router.post('/bicicleta', this.bicicletaController.cadastrarBicicleta);
        this.router.get('/bicicleta', this.bicicletaController.listarBicicletas);
        this.router.get('/bicicleta/:id', this.bicicletaController.getBicicleta);
        this.router.delete('/bicicleta/:id', this.bicicletaController.removerBicicleta);
        this.router.post('/bicicleta/:id/status/:status', this.bicicletaController.alterarStatus);
        this.router.put('/bicicleta/:id', this.bicicletaController.editarBicicleta);
        this.router.post('/bicicleta/integrarNaRede', this.bicicletaController.integrarNaRede);
        this.router.post('/bicicleta/retirarDaRede', this.bicicletaController.retirarDaRede);
    }

    getRouter(){
        return this.router;
    }
}

module.exports = BicicletaRoutes;