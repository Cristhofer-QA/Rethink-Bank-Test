const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/RegisterUser.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');


defineFeature(feature, (test) => {
    const registerSuccess = require('../../variables/register/registerUserSuccess');
    const { method: methodAccount, path: pathAccount, send: sendAccount } = endpoints.account;
    const successRegistrationMessage = 'Cadastro realizado com sucesso.';

    test("Cadastro com dados válidos", ({ given, when, then, and }) => {
        let send, response;

        given("que possuo os dados obrigatórios para cadastro", () => {
            utils.login.
            console.log("GIVEN")
        });

        when("realizo a requisição de cadastro com todos os dados válidos", () => {
            console.log("WHEN")
        });

        then("a resposta deve conter a mensagem de cadastro com sucesso", () => {
            console.log("THEN")
        });

        and("a resposta deve conter o campo confirmToken", () => {
            console.log("AND 1")
        });

        and("o status da resposta deve ser 200", () => {
            console.log("AND 2")
        });

    });
});