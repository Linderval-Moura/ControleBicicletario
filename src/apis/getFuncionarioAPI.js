
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getFuncionario = async (id) => {
    return axios.get(`${process.env.FUNCIONARIO_URL}/funcionario/${id}`).then(response => {
        return response;
    }).catch (error => {
        return error.reponse;
    })
}

module.exports = getFuncionario;