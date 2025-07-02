const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Login.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const userGenerator = require('../../generators/userGenerator');


defineFeature(feature, (test) => {
    let userCreated = null;
    let confirmToken = null;
    let userData;
    let send, response;

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
            send = sendLogin(
                userData.email,
                userData.password
            )

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

});