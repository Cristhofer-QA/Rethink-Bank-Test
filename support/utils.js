const endpoints = require('./endpoints')
const createClient = require('./client');

const { method: methodLogin, path: pathLogin, send: sendLogin } = endpoints.login;
const { method: methodAccount, path: pathAccount, send: sendAccount } = endpoints.account;
const { method: methodRegister, path: pathRegister, send: sendRegister } = endpoints.register;


async function account(send, token = null) {
    const client = createClient(token);
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


module.exports = {
    account,
    login,
    registerUser
};