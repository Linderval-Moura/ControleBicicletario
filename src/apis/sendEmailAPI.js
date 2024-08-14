
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (email,assunto,mensagem) => {
    return axios.post(`${process.env.EMAIL_URL}/enviarEmail`, {email,assunto,mensagem}).then(
        response => {
            return response;
        }).catch(error => {
            return error.response;
        })
}

module.exports = sendEmail;