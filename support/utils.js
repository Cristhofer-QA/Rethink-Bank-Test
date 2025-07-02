const endpoints = require('./endpoints')
const createClient = require('./client');

const { method: methodLogin, path: pathLogin } = endpoints.login;
const { method: methodAccount, path: pathAccount } = endpoints.account;
const { method: methodRegister, path: pathRegister } = endpoints.register;
const { method: methodConfirmEmail, path: pathConfirmEmail } = endpoints.confirm_email;
const { method: methodGeneralBalance, path: pathGeneralBalance } = endpoints.general_balance;


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
};

async function confirmEmail(token) {
    const client = createClient(null, token);
    const response = await client[methodConfirmEmail](pathConfirmEmail);
    return response;
};

async function generalBalance(bearerToken = null) {
    const client = createClient(bearerToken);
    const response = await client[methodGeneralBalance](pathGeneralBalance);
    return response;
};

async function sendPoints(send, bearerToken = null) {
    const client = createClient(bearerToken);
    const response = await client[endpoints.send_point.method](endpoints.send_point.path).send(send);
    return response;
}

async function extractPoints(bearerToken = null) {
    const client = createClient(bearerToken);
    const response = await client[endpoints.extract_point.method](endpoints.extract_point.path);
    return response;
}


module.exports = {
    login,
    account,
    sendPoints,
    confirmEmail,
    registerUser,
    extractPoints,
    generalBalance,
};