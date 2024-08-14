const express = require("express");
const TotemController = require("../controllers/TotemController");

class TotemRoute {
    constructor() {
        this.router = express.Router();
        this.totemController = new TotemController();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.post(
            "/totem",
            this.totemController.cadastrarTotem
        );
        this.router.get(
            "/totem",
            this.totemController.listarTotens
        );
        this.router.get(
            "/totem/:idTotem",
            this.totemController.recuperarTotem
        );
        this.router.put(
            "/totem/:idTotem",
            this.totemController.atualizarTotem
        );
        this.router.delete(
            "/totem/:idTotem",
            this.totemController.deletarTotem
        );

        this.router.get(
            "/totem/:idTotem/trancas",
            this.totemController.listarTrancasEmTotem
        );
        this.router.get(
            "/totem/:idTotem/bicicletas",
            this.totemController.listarbicicletasEmTotem
        );
    }
    
    getRouter() {
        return this.router;
    }
}

module.exports = TotemRoute;