const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/PiggyBankWithdraw.feature"));
const endpoints = require('../../support/endpoints');
const methodsSupports = require('../../support/methodsSupports');
const generalBalanceStatus = require('../../checker/status/generalBalanceStatusCheck');
const generalBalanceFields = require('../../checker/fields/generalBalanceFieldCheck');
const balancePiggyBankStatus = require('../../checker/status/balancePiggyBankStatusCheck');
const withdrawnPiggyBankFields = require('../../checker/fields/withdrawPiggyBankFieldsCheck');
const withdrawnPiggyBankStatus = require('../../checker/status/withdrawPiggyBankStatusCheck');
const extractPointsPiggyBankStatus = require('../../checker/status/piggyBankExtractStatusCheck');
const { send: sendWithdraw } = endpoints.withdraw_points_piggy_bank;

defineFeature(feature, (test) => {
    let response;

    let userData;
    let bearerToken;
    let userCreated;

    let pointsUser;
    let piggyBankBalance;

    beforeEach(async () => {
        const user = await methodsSupports.registerUser();
        userData = user.userData;
        userCreated = user.userCreated;
        bearerToken = user.confirmToken;
        await methodsSupports.confirmEmail(bearerToken);
    });

    test("Extrair zero pontos da caixinha", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 0;

        given("que possuo um usuário cadastrado e validado, sem pontos na caixinha", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBankBalance = response.body.piggy_bank_balance;
        });

        when("realizo a requisição de extração de pontos da caixinha corretamente", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            withdrawnPiggyBankFields.verifyWithdrawSuccess(response);
        });

        and("o status da requisição deve ser 200", () => {
            withdrawnPiggyBankStatus.withdrawPiggyBankSuccessCheck(response);
        });

        and("deve subtrair os pontos extraídos da caixinha do usuário e adicionado ao seu saldo", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser + withdrawnPiggyBank, piggyBankBalance - withdrawnPiggyBank);
        });

        and("não deve gerar nenhum histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            extractPointsPiggyBankStatus.piggyBankExtractSuccessCheck(response);
            expect(response.body.length).toBe(0);
        });
    });

    test("Extrair pontos da caixinha - usuário sem pontos na caixinha", ({ given, when, then, and }) => {
        // Como o usuário já iniciou com 0 pontos na caixinha, não deve ser possível remover pontos
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado, sem pontos na caixinha", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBankBalance = response.body.piggy_bank_balance;
        });

        when("realizo a requisição de extração de pontos da caixinha", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            withdrawnPiggyBankFields.verifyInsufficientPointsPiggyBank(response);
        });

        and("o status da requisição deve ser 400", () => {
            withdrawnPiggyBankStatus.withdrawPiggyPiggyBankFailCheck(response);
        });

        and("não deve alterar os pontos do usuário", async () => {
            response = await utils.generalBalance(bearerToken);
            generalBalanceStatus.checkGeneralBalanceSuccess(response);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBankBalance);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            balancePiggyBankStatus.balancePiggyBankSuccessCheck(extract);
            expect(extract.body.length).toBe(0);
        });
    });

    test("Extrair pontos da caixinha - usuário não ativo", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado, mas não ativo", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBankBalance = response.body.piggy_bank_balance;
            await methodsSupports.accountUser(userData.password, bearerToken);
        });

        when("realizo a requisição de extração de pontos da caixinha", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            withdrawnPiggyBankFields.verifyInvalidToken(response);
        });

        and("o status da requisição deve ser 400", () => {
            withdrawnPiggyBankStatus.withdrawPiggyPiggyBankFailCheck(response);
        });
    });

    test("Extrair pontos da caixinha - Token não informado", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado", async () => {
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(bearerToken);
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBankBalance = response.body.piggy_bank_balance;
        });

        when("realizo a requisição de extração de pontos da caixinha sem informar o token", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, null);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            withdrawnPiggyBankFields.verifyAccessDenied(response);
        });

        and("o status da requisição deve ser 401", () => {
            withdrawnPiggyBankStatus.withdrawPiggyBankAccessDenied(response);
        });
    });

    test("Extrair pontos da caixinha - Token inválido", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado", async () => {
           methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(bearerToken);
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBankBalance = response.body.piggy_bank_balance;
        });

        when("realizo a requisição de extração de pontos da caixinha com um token inválido", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken.toLowerCase());  // Simulando token inválido
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            withdrawnPiggyBankFields.verifyInvalidToken(response);
        });

        and("o status da requisição deve ser 401", () => {
            withdrawnPiggyBankStatus.withdrawPiggyBankAccessDenied(response);
        });
    });
});