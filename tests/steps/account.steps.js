const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Account.feature"));
const endpoints = require('../../support/endpoints');
const accountFields = require('../../checker/fields/accountFieldsCheck');
const accountStatus = require('../../checker/status/accountStatusCheck');
const supportMethods = require('../../support/methodsSupports');
const { send: sendAccount } = endpoints.account;

defineFeature(feature, (test) => {
    let userCreated;
    let confirmToken;
    let userData;

    beforeEach(async () => {
        const user = await supportMethods.registerUser();
        userCreated = user.userCreated;
        confirmToken = user.confirmToken;
        userData = user.userData;
    });

    test("Exclusão correta de conta", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when("logo no sistema com esse usuário", async () => {
            bearerToken = await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, informando a senha correta para esse usuário", async () => {
            send = sendAccount(userData.password);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de sucesso", () => {
            accountFields.verifyAccountSuccessMessage(response);
        });

        and("o status da resposta deve ser 200", () => {
            accountStatus.verifyStatusSuccess(response);
        });
    });

    test("Exclusão de conta informando senha inválida", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when("logo no sistema com esse usuário", async () => {
            bearerToken = await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, informando uma senha incorreta para esse usuário", async () => {
            send = sendAccount(userData.password.toLowerCase());
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            accountFields.verifyInvalidPasswordMessage(response);
        });

        and("o status da resposta deve ser 400", () => {
            accountStatus.verifyStatusPasswordInvalid(response);
        });
    });

    test("Exclusão de conta não informando senha", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when("logo no sistema com esse usuário", async () => {
            bearerToken = await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, informando uma senha vazia", async () => {
            send = sendAccount("");
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            accountFields.verifyInvalidPasswordMessage(response);
        });

        and("o status da resposta deve ser 400", () => {
            accountStatus.verifyStatusPasswordInvalid(response);
        });
    });

    test("Exclusão de conta informando senha nula", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when("logo no sistema com esse usuário", async () => {
            bearerToken = await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, informando uma senha nula", async () => {
            send = sendAccount(null);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            accountFields.verifyInvalidPasswordMessage(response);
        });

        and("o status da resposta deve ser 400", () => {
            accountStatus.verifyStatusPasswordInvalid(response);
        });
    });

    test("Exclusão de conta informando senha de outro usuário", ({ given, when, then, and }) => {
        let send, response, bearerToken, newUserPassword;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        and("possuo a senha de outro usuário cadastrado e validado", async () => {
            const newUser = supportMethods.registerUser();
            newUserPassword = (await newUser).userData.password;
        });

        when("logo no sistema com esse usuário", async () => {
            bearerToken = await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, informando uma senha de um outro usuário", async () => {
            send = sendAccount(newUserPassword);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            accountFields.verifyInvalidPasswordMessage(response);
        });

        and("o status da resposta deve ser 400", () => {
            accountStatus.verifyStatusPasswordInvalid(response);
        });
    });

    test("Exclusão de conta não informando o bearer token", ({ given, when, then, and }) => {
        let send, response;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            supportMethods.verifyUserCreated(userCreated);
            await supportMethods.confirmEmail(confirmToken);
        });

        when("logo no sistema com esse usuário", async () => {
            await supportMethods.loginUser(userData.email, userData.password);
        });

        and("realizo a requisição de exclusão de conta, com dados corretos, mas sem bearer token", async () => {
            send = sendAccount(userData.password);
            response = await utils.account(send, null);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            accountFields.verifyUnauthorizedMessage(response);
        });

        and("o status da resposta deve ser 401", () => {
            accountStatus.verifyStatusUnauthorized(response);
        });
    });
});