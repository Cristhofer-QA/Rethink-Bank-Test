const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/ConfirmEmail.feature"));
const utils = require('../../support/utils');
const methodsSupports = require('../../support/methodsSupports');
const confirmEmailFields = require('../../checker/fields/confirmEmailFieldsCheck');
const confirmEmailStatus = require('../../checker/status/confirmEmailStatusCheck');


defineFeature(feature, (test) => {
    let userCreated, confirmToken;

    beforeEach(async () => {
        const user = await methodsSupports.registerUser();
        userCreated = user.userCreated;
        confirmToken = user.confirmToken;
    });

    test("Confirmação correta de e-mail", ({ given, when, then, and }) => {

        given('que tenho um usuário cadastrado que não possua e-mail confirmado', async () => {
            methodsSupports.verifyUserCreated();
        });

        when('realizo a requisição de confirmar e-mail para o usuário que não foi confirmado', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da resposta deve ser 200 (para a confirmação do e-mail ainda não confirmado)', () => {
            confirmEmailStatus.confirmEmailSuccess(response);
        });

        and('a resposta deve apresentar a mensagem de confirmação (do e-mail ainda não confirmado)', () => {
            confirmEmailFields.verifyConfirmEmailSuccess(response);
        });
    });

    test("Confirmar um e-mail já confirmado", ({ given, when, then, and }) => {
        let response;

        given('que tenha um usuário cadastrado com um e-mail já confirmado', async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when('realizo a requisição de confirmar e-mail para o usuário que já foi confirmado', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da responta deve ser 200 (para a confirmação já realizada)', () => {
            confirmEmailStatus.confirmEmailSuccess(response);
        });

        and('a resposta deve apresentar a mensagem de confirmação (para a confirmação já realizada)', () => {
            confirmEmailFields.verifyConfirmEmailSuccess(response);
        });
    });

    test("Confirmar um e-mail com um token inválido", ({ given, when, then, and }) => {
        let response;
        given('que tenha um usuário cadastrado e com o token retornado', async () => {
            supportMethods.verifyUserCreated(userCreated);
            confirmToken = confirmToken + 'err';
        });

        when('realizo a requisição de confirmar e-mail informando um token incorreto', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da responta deve ser 400 (para a confirmação com token incorreto)', () => {
            confirmEmailStatus.verifyIncorrectToken(response);
        });

        and('a resposta não deve apresentar a mensagem de confirmação (para a confirmação com token incorreto)', () => {
            confirmEmailFields.verifyConfirmTokenInvalid(response);
        });
    });

    test("Confirmar um e-mail sem token", ({ given, when, then, and }) => {
        let response;

        given('que tenha um usuário cadastrado e com o token retornado (validação sem token)', async () => {
            supportMethods.verifyUserCreated(userCreated);
        });

        when('realizo a requisição de confirmar e-mail não informando um token', async () => {
            response = await utils.confirmEmail(null);
        });

        then('o status da responta deve ser 400 (para a confirmação sem token)', () => {
            confirmEmailStatus.verifyIncorrectToken(response);
        });

        and('a resposta não deve apresentar a mensagem de confirmação (para a confirmação sem token)', () => {
            confirmEmailFields.verifyConfirmTokenInvalid(response);
        });
    });
});