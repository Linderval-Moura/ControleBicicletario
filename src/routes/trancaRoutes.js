const express = require('express');
const TrancaController = require('../controllers/trancaController');

class TrancaRoutes {
    constructor() {
        this.router = express.Router();
        this.trancaController = new TrancaController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/tranca', this.trancaController.getTrancas);
        this.router.post('/tranca', this.trancaController.cadastrarTranca);
        this.router.get('/tranca/:idTranca', this.trancaController.getTrancaByID);
        this.router.put('/tranca/:idTranca', this.trancaController.editTranca);
        this.router.delete('/tranca/:idTranca', this.trancaController.removeTranca);
        this.router.post('/tranca/:idTranca/destrancar', this.trancaController.destrancarTranca);
        this.router.post('/tranca/:idTranca/status/:acao', this.trancaController.alterarStatusTranca);

        this.router.get('/tranca/:idTranca/bicicleta', this.trancaController.getBicicletaFromTranca);
        this.router.post('/tranca/:idTranca/trancar', this.trancaController.trancarBicicleta);
        this.router.post('/tranca/integrarNaRede', this.trancaController.integrarNaRede);
        this.router.post('/tranca/retirarDaRede', this.trancaController.retirarDaRede);

    }

    getRouter() {
        return this.router;
    }
}

module.exports = TrancaRoutes;