const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Login.feature"));
const endpoints = require('../../support/endpoints');
const generator = require('../../generators/baseGenerator');
const loginFields = require('../../checker/fields/loginFieldsCheck');
const loginStatus = require('../../checker/status/loginStatusCheck');
const methodsSupports = require('../../support/methodsSupports');
const featuresVariables = require("../../variables/featuresVariables");
const { send: sendLogin } = endpoints.login;


defineFeature(feature, (test) => {
    let userData;
    let userCreated;
    let confirmToken;

    beforeEach(async () => {
        const user = await methodsSupports.registerUser();
        userCreated = user.userCreated;
        confirmToken = user.confirmToken;
        userData = user.userData;
    });


    test("Login com usuário cadastrado e validado", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await utils.confirmEmail(confirmToken);
        });

        when("realizo a requisição de login, informando as credenciais do usuário validado", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
        });

        then("a resposta deve conter um token", () => {
            loginFields.fieldsLoginSuccessCheck(response);
        });

        and("o status da resposta deve ser 200", () => {
            loginStatus.loginSuccessStatusCheck(response);
        });
    });

    test("Login com usuário cadastrado e não validado", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email não confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
        });

        when("realizo a requisição de login, informando as credenciais do usuário não validado", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("a resposta de conter uma mensagem de conta não validada", () => {
            loginFields.verifyLoginEmailNotConfirmed(response);
        });

        and("o status da resposta deve ser 403", () => {
            loginStatus.loginEmailNotConfirmed(response);
        });
    });


    test("Login com campos incorretos - <scenario>", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await utils.confirmEmail(confirmToken);
        });

        when(/^realizo a requisição de login, informando o campo "([^"]*)" incorreto$/, async (fieldIncorrect) => {
            let emailSend = userData.email;
            let passwordSend = userData.password;

            if (fieldIncorrect === featuresVariables.sendEmailIncorrect) {
                emailSend = "err" + userData.email;
            };

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = "err" + userData.password;
            };

            send = sendLogin(emailSend, passwordSend);
            response = await utils.login(send);

        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            loginFields.verifyLoginCredentialsInvalid(response);
        });

        and("o status da resposta deve ser 400", () => {
            loginStatus.loginCredentialsInvalid(response);
        });
    });

    test("Login com campos inválidos - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(confirmToken);
        });

        when(/^realizo a requisição de login, informando o campo "([^"]*)" inválido$/, async (fieldIncorrect) => {
            let emailSend = userData.email;
            let passwordSend = userData.password;

            if (fieldIncorrect === featuresVariables.sendEmailIncorrect) {
                emailSend = generator.generateEmail(featuresVariables.emailInvalid);
            };

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = generator.generatePassword(featuresVariables.passwordMinusDigit);
            };

            send = sendLogin(emailSend, passwordSend);
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            loginFields.verifyLoginCredentialsInvalid(response);
        });

        and("o status da resposta deve ser 400", () => {
            loginStatus.loginCredentialsInvalid(response);
        });
    });


    test("Login com campos nulos - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(confirmToken);
        });

        when(/^realizo a requisição de login, informando o campo "([^"]*)" null$/, async (fieldIncorrect) => {
            let emailSend = userData.email;
            let passwordSend = userData.password;

            if (fieldIncorrect === featuresVariables.sendEmailIncorrect) {
                emailSend = null;
            };

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = null;
            };

            if (fieldIncorrect === featuresVariables.sendAllFieldsIncorrect) {
                emailSend = null;
                passwordSend = null;
            };

            send = sendLogin(emailSend, passwordSend);
            response = await utils.login(send);

        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            loginFields.verifyLoginCredentialsInvalid(response);
        });

        and("o status da resposta deve ser 400", () => {
            loginStatus.loginCredentialsInvalid(response);
        });
    });

    test("Login com campos vazios - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(confirmToken);
        });

        when(/^realizo a requisição de login, informando o campo "([^"]*)" vazio$/, async (fieldIncorrect) => {
            let emailSend = userData.email;
            let passwordSend = userData.password;

            if (fieldIncorrect === featuresVariables.sendEmailIncorrect) {
                emailSend = "";
            };

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = "";
            };

            if (fieldIncorrect === featuresVariables.sendAllFieldsIncorrect) {
                emailSend = "";
                passwordSend = "";
            };

            send = sendLogin(emailSend, passwordSend);
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            loginFields.verifyLoginCredentialsInvalid(response);
        });

        and("o status da resposta deve ser 400", () => {
            loginStatus.loginCredentialsInvalid(response);
        });
    });

    test("Login correto mas para usuário deletado", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        // Nesse passo, vou confirmar o e-mail do usuário criado e excluir a conta desse usuário
        given("que tenho um usuário cadastrado, com email confirmado, mas deletado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(confirmToken);
            bearerToken = await methodsSupports.loginUser(userData.email, userData.password);
            await methodsSupports.accountUser(userData.password, bearerToken);
        });

        when("realizo a requisição de login, informando as informações desse usuário", async () => {
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            loginFields.verifyNotToken(response);
        });

        and("o status da resposta não deve ser 200", () => {
            loginStatus.loginCredentialsInvalid(response);
        });
    }, 20000);
});