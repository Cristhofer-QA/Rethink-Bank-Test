const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/RegisterUser.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;


defineFeature(feature, (test) => {
    const registerSuccess = require('../../variables/register/registerUserSuccessVariable');
    const successRegistrationMessage = 'Cadastro realizado com sucesso.';

    test("Cadastro com dados válidos", ({ given, when, then, and }) => {
        let send, response;
        const cnpj = registerSuccess.cpf;
        const fullName = registerSuccess.full_name;
        const email = registerSuccess.email;
        const password = registerSuccess.password;
        const confirmPassword = password;

        given("que possuo os dados obrigatórios para cadastro", () => {
            send = sendRegister(cnpj, fullName, email, password, confirmPassword);
        });

        when("realizo a requisição de cadastro com todos os dados válidos", async () => {
            response = await utils.registerUser(send);
        });

        then("a resposta deve conter a mensagem de cadastro com sucesso", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(successRegistrationMessage);
        });

        and("a resposta deve conter o campo confirmToken", () => {
            expect(response.body).toHaveProperty('confirmToken');
            expect(response.body.confirmToken).not.toBeNull();
        });

        and("o status da resposta deve ser 201", () => {
            expect(response.status).toBe(201);
        });

    });
});