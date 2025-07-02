const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Login.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const { send: sendAccount } = endpoints.account;
const userGenerator = require('../../generators/userGenerator');
const featuresVariables = require("../../variables/featuresVariables");


defineFeature(feature, (test) => {
    let userCreated = null;
    let confirmToken = null;
    let userData;

    const credentialsInvalidMessage = 'Credenciais inválidas';
    const emailNotConfirmed = 'E-mail não confirmado';

    beforeEach(async () => {
        userData = userGenerator.generateUserValid();
        const sent = sendRegister(
            userData.cpf,
            userData.fullName,
            userData.email,
            userData.password,
            userData.confirmPassword
        )

        try {
            const res = await utils.registerUser(sent);
            userCreated = res.status === 201;

            confirmToken = res.body.confirmToken;
        } catch {
            userCreated = false;
        }
    });


    test("Login com usuário cadastrado e validado", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("realizo a requisição de login, informando as credenciais do usuário validado", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
        });

        then("a resposta deve conter um token", () => {
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).not.toBeNull();
            expect(response.body.token).toBeDefined();
        });

        and("o status da resposta deve ser 200", () => {
            expect(response.status).toBe(200);
        });

    });

    test("Login com usuário cadastrado e não validado", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email não confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };
        });

        when("realizo a requisição de login, informando as credenciais do usuário não validado", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            expect(response.body).not.toHaveProperty('token');
        });

        and("a resposta de conter uma mensagem de conta não validada", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(emailNotConfirmed);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });


    test("Login com campos incorretos - <scenario>", ({ given, when, then, and }) => {
        let send, response;

        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

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
            expect(response.body).not.toHaveProperty('token');
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(credentialsInvalidMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Login com campos inválidos - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

        });

        when(/^realizo a requisição de login, informando o campo "([^"]*)" inválido$/, async (fieldIncorrect) => {
            let emailSend = userData.email;
            let passwordSend = userData.password;

            if (fieldIncorrect === featuresVariables.sendEmailIncorrect) {
                emailSend = userData.email.replace('@'), "";
            };

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = userData.password.slice(5);
            };

            send = sendLogin(emailSend, passwordSend);
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            expect(response.body).not.toHaveProperty('token');
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(credentialsInvalidMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });


    test("Login com campos nulos - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

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
            expect(response.body).not.toHaveProperty('token');
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(credentialsInvalidMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Login com campos vazios - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given("que tenho um usuário cadastrado e com email confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

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

            console.log("send");
            console.log(send);

            response = await utils.login(send);
            console.log("response");
            console.log(response.body);
            console.log(response.status);

        });

        then("a resposta não deve conter um token", () => {
            expect(response.body).not.toHaveProperty('token');
        });

        and("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(credentialsInvalidMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Login correto mas para usuário deletado", ({ given, when, then, and }) => {
        let send, response, tokenLogin;

        // Nesse passo, vou confirmar o e-mail do usuário criado e excluir a conta desse usuário
        given("que tenho um usuário cadastrado, com email confirmado, mas deletado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

            let emailSend = userData.email;
            let passwordSend = userData.password;
            send = sendLogin(emailSend, passwordSend);

            const resLoginValido = await utils.login(send);

            if (resLoginValido.status !== 200) {
                throw new Error('Primeiro login não realizado (para pegar o token), cenário ignorado');
            };

            tokenLogin = resLoginValido.body.token;

            const bodySendAccount = sendAccount(passwordSend);

            const resAccount = await utils.account(bodySendAccount, tokenLogin, null);
            if (resAccount.status !== 200) {
                throw new Error('Conta não foi excluída, cenário ignorado');
            };
        });

        when("realizo a requisição de login, informando as informações desse usuário", async () => {
            response = await utils.login(send);
        });

        then("a resposta não deve conter um token", () => {
            expect(response.body).not.toHaveProperty('token');
        });

        and("o status da resposta não deve ser 200", () => {
            expect(response.status).not.toBe(400);
        });

    }, 20000);


});