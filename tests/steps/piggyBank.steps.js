const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/PiggyBank.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const { send: sendAccount } = endpoints.account;
const { send: sendSendPointsPiggyBank } = endpoints.send_points_piggy_bank;
const { send: sendWithdraw } = endpoints.withdraw_points_piggy_bank;
const generator = require('../../generators//userGenerator');


defineFeature(feature, (test) => {
    const depositedSuccessMessage = 'Depósito na caixinha realizado.';
    const insufficientPointsMessage = 'Saldo insuficiente';
    const accessDeniedMessage = 'Não autorizado';
    const invalidTokenMessage = 'Token inválido ou expirado';
    const insufficientPointsPiggyBankMessage = 'Saldo na caixinha insuficiente';

    let bearerToken;
    let userData;
    let response;

    beforeEach(async () => {
        userData = generator.generateUserValid();
        const sent = sendRegister(
            userData.cpf,
            userData.fullName,
            userData.email,
            userData.password,
            userData.confirmPassword
        )
        const res = await utils.registerUser(sent);
        if (res.status !== 201) {
            throw new Error('Usuário não cadastrado, cenário ignorado');
        };

        const confirmToken = res.body.confirmToken;
        const resValid = await utils.confirmEmail(confirmToken);

        if (resValid.status !== 200) {
            throw new Error('Email do usuário não validado, cenário ignorado');
        };

        const sentLogin = sendLogin(userData.email, userData.password);

        const respLogin = await utils.login(sentLogin);


        if (respLogin.status !== 200) {
            throw new Error('Usuário não logado, cenário ignorado');
        }
        bearerToken = respLogin.body.token;

    });

    test("Adicionar pontos à caixinha", ({ given, when, then, and }) => {

        let pointsUser = 0;
        const sendPiggyBank = 27;

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const generalBalance = await utils.generalBalance(bearerToken);
            pointsUser = generalBalance.body.normal_balance;
        });

        when("realizo a requisição de adição de pontos à caixinha corretamente", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(depositedSuccessMessage);
        });

        and("o status da requisição deve ser 200", () => {
            expect(response.status).toBe(200);
        });

        and("deve adicionar os pontos enviados à caixinha do usuário", async () => {
            const generalBalance = await utils.generalBalance(bearerToken);
            expect(generalBalance.status).toBe(200);
            expect(generalBalance.body).toHaveProperty('normal_balance');
            expect(generalBalance.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalance.body.piggy_bank_balance).toBe(sendPiggyBank);
            expect(generalBalance.body.normal_balance).toBe(pointsUser - sendPiggyBank);
        });

        and("deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body[0]).toHaveProperty('amount');
            expect(extract.body[0].amount).toBe(sendPiggyBank);
            expect(extract.body[0]).toHaveProperty('type');
            expect(extract.body[0].type).toBe('deposit');
        });

    });

    test("Adicionar pontos à caixinha - usuário sem pontos suficientes", ({ given, when, then, and }) => {

        let pointsUser;
        const sendPiggyBank = pointsUser + 1; // Tentando enviar mais pontos do que o usuário possui

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const generalBalance = await utils.generalBalance(bearerToken);
            pointsUser = generalBalance.body.normal_balance;
        });

        when("realizo a requisição de adição de pontos à caixinha, com um valor maior do que o disponível", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(insufficientPointsMessage);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            const generalBalance = await utils.generalBalance(bearerToken);
            expect(generalBalance.status).toBe(200);
            expect(generalBalance.body).toHaveProperty('normal_balance');
            expect(generalBalance.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalance.body.piggy_bank_balance).toBe(0);
            expect(generalBalance.body.normal_balance).toBe(pointsUser);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body.length).toBe(0);
        });

    });

    test("Adicionar todos os pontos à caixinha", ({ given, when, then, and }) => {

        let pointsUser;
        let sendPiggyBank;

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const generalBalance = await utils.generalBalance(bearerToken);
            pointsUser = generalBalance.body.normal_balance;
            sendPiggyBank = pointsUser; // Enviando todos os pontos disponíveis
        });

        when("realizo a requisição de adição de todos os pontos à caixinha", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(depositedSuccessMessage);
        });

        and("o status da requisição deve ser 200", () => {
            expect(response.status).toBe(200);
        });

        and("deve adicionar todos os pontos enviados à caixinha do usuário", async () => {
            const generalBalance = await utils.generalBalance(bearerToken);
            expect(generalBalance.status).toBe(200);
            expect(generalBalance.body).toHaveProperty('normal_balance');
            expect(generalBalance.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalance.body.piggy_bank_balance).toBe(sendPiggyBank);
            expect(generalBalance.body.normal_balance).toBe(pointsUser - sendPiggyBank);
        });

        and("deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body[0]).toHaveProperty('amount');
            expect(extract.body[0].amount).toBe(sendPiggyBank);
            expect(extract.body[0]).toHaveProperty('type');
            expect(extract.body[0].type).toBe('deposit');
        });

    });

    test("Não enviar pontos à caixinha", ({ given, when, then, and }) => {

        let pointsUser;
        let sendPiggyBank = 0;

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const generalBalance = await utils.generalBalance(bearerToken);
            pointsUser = generalBalance.body.normal_balance;
        });

        when("realizo a requisição de adição de pontos à caixinha, mas não envio nenhum ponto", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(depositedSuccessMessage);
        });

        and("o status da requisição deve ser 200", () => {
            expect(response.status).toBe(200);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            const generalBalance = await utils.generalBalance(bearerToken);
            expect(generalBalance.status).toBe(200);
            expect(generalBalance.body).toHaveProperty('normal_balance');
            expect(generalBalance.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalance.body.piggy_bank_balance).toBe(sendPiggyBank);
            expect(generalBalance.body.normal_balance).toBe(pointsUser - sendPiggyBank);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body.length).toBe(0);
        });

    });

    test("Enviar pontos negativos à caixinha", ({ given, when, then, and }) => {

        let sendPiggyBank = -59; // Tentando enviar pontos negativos

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
        });

        when("realizo a requisição de adição de pontos à caixinha com um valor negativo", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(insufficientPointsMessage);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

        and("não deve adicionar os pontos enviados à caixinha do usuário", async () => {
            const generalBalance = await utils.generalBalance(bearerToken);
            expect(generalBalance.status).toBe(200);
            expect(generalBalance.body).toHaveProperty('normal_balance');
            expect(generalBalance.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalance.body.piggy_bank_balance).toBe(sendPiggyBank);
            expect(generalBalance.body.normal_balance).toBe(pointsUser - sendPiggyBank);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body.length).toBe(0);
        });

    });

    test("Adicionar pontos à caixinha - usuário não ativo", ({ given, when, then, and }) => {

        let sendPiggyBank = 6;

        given("que possuo um usuário cadastrado e validado, mas não ativo", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }

            const bodyAccount = sendAccount(userData.password);
            const responseAccount = await utils.account(bodyAccount, bearerToken);
            if (responseAccount.status !== 200) {
                throw new Error('Usuário não desativado, cenário ignorado');
            }

        });

        when("realizo a requisição de adição de pontos à caixinha", async () => {
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(invalidTokenMessage);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Adicionar pontos à caixinha - Token não informado", ({ given, when, then, and }) => {

        let sendPiggyBank = 6;

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
        });

        when("realizo a requisição de adição de pontos à caixinha sem informar o token", async () => {
            bearerToken = null; // Simulando ausência de token
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(accessDeniedMessage);
        });

        and("o status da requisição deve ser 401", () => {
            expect(response.status).toBe(401);
        });

    });

    test("Adicionar pontos à caixinha - Token inválido", ({ given, when, then, and }) => {

        let sendPiggyBank = 6;

        given("que possuo um usuário cadastrado e validado, com pontos", async () => {
            // Esse passo já é tratado no beforeEach
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
        });

        when("realizo a requisição de adição de pontos à caixinha com um token inválido", async () => {
            bearerToken = bearerToken.toLowerCase(); // Simulando token inválido
            const send = sendSendPointsPiggyBank(sendPiggyBank);
            response = await utils.sendPointsPiggyBank(send, bearerToken);

        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(invalidTokenMessage);
        });

        and("o status da requisição deve ser 401", () => {
            expect(response.status).toBe(401);
        });

    });

    test("Extrair pontos da caixinha - usuário sem pontos na caixinha", ({ given, when, then, and }) => {
        // Como o usuário já iniciou com 0 pontos na caixinha, não deve ser possível remover pontos
        const withdrawnPiggyBank = 25;
        const piggyBankBalance = 0;
        let pointsUser;
        let generalBalanceAfter;

        given("que possuo um usuário cadastrado e validado, sem pontos na caixinha", async () => {
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const generalBalance = await utils.generalBalance(bearerToken);
            if (generalBalance.status !== 200) {
                throw new Error('Erro ao obter saldo geral do usuário, cenário ignorado');
            }
            pointsUser = generalBalance.body.normal_balance;
        });

        when("realizo a requisição de extração de pontos da caixinha", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(insufficientPointsPiggyBankMessage);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

        and("não deve subtrair os pontos extraídos da caixinha do usuário", async () => {
            generalBalanceAfter = await utils.generalBalance(bearerToken);
            expect(generalBalanceAfter.status).toBe(200);
            expect(generalBalanceAfter.body).toHaveProperty('piggy_bank_balance');
            expect(generalBalanceAfter.body.piggy_bank_balance).toBe(piggyBankBalance);
        });

        and("não deve adicionar os pontos extraídos à quantidade total do usuário", () => {
            expect(generalBalanceAfter.body).toHaveProperty('normal_balance');
            expect(generalBalanceAfter.body.normal_balance).toBe(pointsUser);

        });

        and("não deve gerar um histórico de transação de pontos para o usuário", async () => {
            const extract = await utils.pointsPiggyBankExtract(bearerToken);
            expect(extract.status).toBe(200);
            expect(extract.body.length).toBe(0);
        });
    });

    test("Extrair pontos da caixinha - usuário não ativo", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado, mas não ativo", async () => {
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
            const bodyAccount = sendAccount(userData.password);
            const responseAccount = await utils.account(bodyAccount, bearerToken);
            if (responseAccount.status !== 200) {
                throw new Error('Usuário não desativado, cenário ignorado');
            }
        });

        when("realizo a requisição de extração de pontos da caixinha", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(invalidTokenMessage);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Extrair pontos da caixinha - Token não informado", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado", async () => {
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
        });

        when("realizo a requisição de extração de pontos da caixinha sem informar o token", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, null);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(accessDeniedMessage);
        });

        and("o status da requisição deve ser 401", () => {
            expect(response.status).toBe(401);
        });

    });

    test("Extrair pontos da caixinha - Token inválido", ({ given, when, then, and }) => {
        const withdrawnPiggyBank = 25;

        given("que possuo um usuário cadastrado e validado", async () => {
            if (!bearerToken) {
                throw new Error('Usuário não logado, cenário ignorado');
            }
        });

        when("realizo a requisição de extração de pontos da caixinha com um token inválido", async () => {
            const send = sendWithdraw(withdrawnPiggyBank);
            response = await utils.withdrawPointsPiggyBank(send, bearerToken.toLowerCase());  // Simulando token inválido
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(invalidTokenMessage);
        });

        and("o status da requisição deve ser 401", () => {
            expect(response.status).toBe(401);
        });

    });

});