const userGenerator = require('../generators/userGenerator');
const endpoints = require('../support/endpoints');
const utils = require('../support/utils');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;

async function confirmEmail(token) {

    const res = await utils.confirmEmail(token);

    if (res.status !== 200) {
        throw new Error('Email não foi validado, cenário ignorado');
    };


};

async function registerUser() {
    let confirmToken;
    let userCreated = true;
    const userData = userGenerator.generateUserValid();
    const sent = sendRegister(
        userData.cpf,
        userData.fullName,
        userData.email,
        userData.password,
        userData.confirmPassword
    );

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

    if (res.status !== 200) {
        throw new Error('Usuário não foi logado, cenário ignorado');
    };

    return res.body.token;
};





function verifyUserCreated(userCreated) {
    if (!userCreated) {
        throw new Error('Usuário não foi criado, cenário ignorado');
    };
};



module.exports = {
    confirmEmail,
    verifyUserCreated,
    registerUser,
    loginUser,
};