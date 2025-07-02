const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Login.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const userGenerator = require('../../generators/userGenerator');
const featuresVariables = require("../../variables/featuresVariables");


defineFeature(feature, (test) => {
    let userCreated = null;
    let confirmToken = null;
    let userData;
    let send, response;

    const credentialsInvalidMessage = 'Credenciais inválidas';

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


    test.skip("Login com usuário cadastrado e validado", ({ given, when, then, and }) => {

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

    test.skip("Login com usuário cadastrado e não validado", ({ given, when, then, and }) => {

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
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).not.toBeNull();
            expect(response.body.token).toBeDefined();
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(200);
        });

    });


    test("Login com campos incorretos - <scenario>", ({ given, when, then, and }) => {

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
            }

            if (fieldIncorrect === featuresVariables.sendPasswordIncorrect) {
                passwordSend = "err" + userData.password;
            }


            send = sendLogin(
                emailSend,
                passwordSend
            )

            response = await utils.login(send);

        });

        then("a resposta não deve conter um token", () => {
            expect(response.body).not.toHaveProperty('token');
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(credentialsInvalidMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });


});