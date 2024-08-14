
const express = require('express');

class HelloWorld {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/helloWorld", (request, response) => {
            return response.status(200).json("Hello World!");
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = HelloWorld;