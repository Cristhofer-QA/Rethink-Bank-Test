const endpoints = require('./endpoints')
const createClient = require('./client');

const { method: methodLogin, path: pathLogin, send: sendLogin } = endpoints.login;
const { method: methodAccount, path: pathAccount, send: sendAccount } = endpoints.account;
const { method: methodRegister, path: pathRegister, send: sendRegister } = endpoints.register;
const { method: methodConfirmEmail, path: pathConfirmEmail } = endpoints.confirm_email;


async function account(send, bearerToken = null, token = null) {
    const client = createClient(bearerToken, token);
    const response = await client[methodAccount](pathAccount).send(send);
    return response;
};

async function login(send) {
    const client = createClient();
    const response = await client[methodLogin](pathLogin).send(send);
    return response;
};

async function registerUser(send) {
    const client = createClient();
    const response = await client[methodRegister](pathRegister).send(send);
    return response;
}

async function confirmEmail(token) {
    const client = createClient(null, token);
    const response = await client[methodConfirmEmail](pathConfirmEmail);
    return response;
}


module.exports = {
    account,
    login,
    registerUser,
    confirmEmail
};