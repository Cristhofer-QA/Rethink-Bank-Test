const { defineFeature, loadFeature } = require("jest-cucumber");
const endpoints = require('../../support/endpoints');
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/PiggyBankDeposit.feature"));
const methodsSupports = require('../../support/methodsSupports');
const generalBalanceFields = require('../../checker/fields/generalBalanceFieldsCheck');
const depositPiggyBankFields = require('../../checker/fields/depositPiggyBankFieldsCheck');
const depositPiggyBankStatus = require('../../checker/status/depositPiggyBankStatusCheck');
const { send: sendSendPointsPiggyBank } = endpoints.send_points_piggy_bank;

defineFeature(feature, (test) => {
    let response, send;

    let bearerToken;
    let userData;
    let pointsUser;
    let piggyBank;
    let sendPiggyBank;

    beforeEach(async () => {
        const user = await methodsSupports.registerUser();
        const serCreated = user.userCreated;
        const confirmToken = user.confirmToken;
        userData = user.userData;
        methodsSupports.verifyUserCreated(serCreated);
        await methodsSupports.confirmEmail(confirmToken);
        bearerToken = await methodsSupports.loginUser(userData.email, userData.password);
    });

    test("Adicionar pontos à caixinha", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(pointsUser / 2); // Enviando metade dos pontos
        });

        when("realizo a requisição de adição de pontos à caixinha corretamente", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            depositPiggyBankFields.depositedSuccessMessageCheck(response);
        });

        and("o status da requisição deve ser 200", () => {
            depositPiggyBankStatus.depositPiggyBankSuccessCheck(response);
        });

        and("deve adicionar os pontos enviados à caixinha do usuário", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBank + sendPiggyBank);
        });

        and("deve gerar um histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            expect(response.body[0]).toHaveProperty('amount');
            expect(response.body[0].amount).toBe(sendPiggyBank);
            expect(response.body[0]).toHaveProperty('type');
            expect(response.body[0].type).toBe('deposit');
        });
    });

    test("Adicionar pontos à caixinha - usuário sem pontos suficientes", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(pointsUser + 1); // Enviando a mais que o usuário possui
        });

        when("realizo a requisição de adição de pontos à caixinha, com um valor maior do que o disponível", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            depositPiggyBankFields.insufficientPointsMessageCheck(response);
        });

        and("o status da requisição deve ser 400", () => {
            depositPiggyBankStatus.depositPiggyBankFailCheck(response);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBank);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            expect(response.body.length).toBe(0);
        });
    });

    test("Adicionar todos os pontos à caixinha", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = pointsUser;
        });

        when("realizo a requisição de adição de todos os pontos à caixinha", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            depositPiggyBankFields.depositedSuccessMessageCheck(response);
        });

        and("o status da requisição deve ser 200", () => {
            depositPiggyBankStatus.depositPiggyBankSuccessCheck(response);
        });

        and("deve adicionar todos os pontos enviados à caixinha do usuário", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBank + sendPiggyBank);
        });

        and("deve gerar um histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            expect(response.body[0]).toHaveProperty('amount');
            expect(response.body[0].amount).toBe(sendPiggyBank);
            expect(response.body[0]).toHaveProperty('type');
            expect(response.body[0].type).toBe('deposit');
        });
    });

    test("Não enviar pontos à caixinha", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = 0;
        });

        when("realizo a requisição de adição de pontos à caixinha, mas não envio nenhum ponto", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            depositPiggyBankFields.depositedSuccessMessageCheck(response);
        });

        and("o status da requisição deve ser 200", () => {
            depositPiggyBankStatus.depositPiggyBankSuccessCheck(response);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBank);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            expect(response.body.length).toBe(0);
        });
    });

    test("Enviar pontos negativos à caixinha", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(-59);  // Enviando pontos negativos
        });

        when("realizo a requisição de adição de pontos à caixinha com um valor negativo", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            depositPiggyBankFields.insufficientPointsMessageCheck(response);
        });

        and("o status da requisição deve ser 400", () => {
            depositPiggyBankStatus.depositPiggyBankFailCheck(response);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            generalBalanceFields.verifyValuesPoints(response, pointsUser, piggyBank);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            response = await methodsSupports.piggyBankExtract(bearerToken);
            expect(response.body.length).toBe(0);
        });
    });

    test("Adicionar pontos à caixinha - usuário não ativo", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, mas não ativo", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(pointsUser / 2); // Enviando metade dos pontos
            await methodsSupports.accountUser(userData.password, bearerToken);
        });

        when("realizo a requisição de adição de pontos à caixinha", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            depositPiggyBankFields.invalidTokenMessageCheck(response);
        });

        and("o status da requisição deve ser 400", () => {
            depositPiggyBankStatus.depositPiggyBankFailCheck(response);
        });
    });

    test("Adicionar pontos à caixinha - Token não informado", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(piggyBank / 2);
        });

        when("realizo a requisição de adição de pontos à caixinha sem informar o token", async () => {
            bearerToken = null; // Simulando ausência de token
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            depositPiggyBankFields.accessDeniedMessageCheck(response);
        });

        and("o status da requisição deve ser 401", () => {
            depositPiggyBankStatus.depositPiggyBankInvalidTokenCheck(response);
        });
    });

    test("Adicionar pontos à caixinha - Token inválido", ({ given, when, then, and }) => {
        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            response = await methodsSupports.generalBalance(bearerToken);
            pointsUser = response.body.normal_balance;
            piggyBank = response.body.piggy_bank_balance;
            sendPiggyBank = parseInt(piggyBank / 2);
        });

        when("realizo a requisição de adição de pontos à caixinha com um token inválido", async () => {
            send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, 'error'); // Simulando token inválido
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            depositPiggyBankFields.invalidTokenMessageCheck(response);
        });

        and("o status da requisição deve ser 401", () => {
            depositPiggyBankStatus.depositPiggyBankInvalidTokenCheck(response);
        });
    });
});