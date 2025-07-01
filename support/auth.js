const utils = require('./utils');


async function getToken(emailSend, passwordSend) {
    const response = utils.login(emailSend, passwordSend);

    if (response.status !== 200) {
        throw new Error(`Erro no login (getToken, arquivo auth.js). Status: ${response.status}`);
    };
    
    return response.body.token;
};

module.exports = { getToken };
