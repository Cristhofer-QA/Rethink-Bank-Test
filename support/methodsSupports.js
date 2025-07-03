const utils = require('../support/utils');
const endpoints = require('../support/endpoints');
const userGenerator = require('../generators/userGenerator');
const loginStatusSuccess = require('../checker/status/loginStatusCheck').loginSuccess;
const accountStatusSuccess = require('../checker/status/accountStatusCheck').accountSuccess;
const confirmEmailStatusCheck = require('../checker/status/confirmEmailStatusCheck').confirmEmailSuccess;
const { send: sendLogin } = endpoints.login;
const { send: sendAccount } = endpoints.account;
const { send: sendRegister } = endpoints.register;

async function confirmEmail(token) {
    const res = await utils.confirmEmail(token);
    if (res.status !== confirmEmailStatusCheck) {
        throw new Error('Email não foi validado, cenário ignorado');
    };
};

async function registerUser() {
    let confirmToken;
    let userCreated = true;
    const userData = userGenerator.generateUserValid();
    const sent = sendRegister(userData.cpf, userData.fullName, userData.email, userData.password, userData.confirmPassword);
    try {
        const response = await utils.registerUser(sent);
        confirmToken = response.body.confirmToken;
    } catch {
        userCreated = false;
    };
    return { userCreated, confirmToken, userData };
};

async function loginUser(email, password) {
    const sent = sendLogin(email, password);
    const res = await utils.login(sent);
    if (res.status !== loginStatusSuccess) {
        throw new Error('Usuário não foi logado, cenário ignorado');
    };
    return res.body.token;
};

async function accountUser(password, bearerToken) {
    const send = sendAccount(password);
    const response = await utils.account(send, bearerToken);
    if (response.status !== accountStatusSuccess) {
        throw new Error('Usuário não foi deletado, cenário ignorado');
    };
    return response;
};




function verifyUserCreated(userCreated) {
    if (!userCreated) {
        throw new Error('Usuário não foi criado, cenário ignorado');
    };
};



module.exports = {
    loginUser,
    accountUser,
    confirmEmail,
    registerUser,
    verifyUserCreated,
};