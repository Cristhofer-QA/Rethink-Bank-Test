const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Points.feature"));
const endpoints = require('../../support/endpoints');
const generator = require('../../generators//userGenerator');
const pointsFields = require('../../checker/fields/sendPointsFieldsCheck');
const pointsStatus = require('../../checker/status/sendPointsStatusCheck');
const methodsSupports = require('../../support/methodsSupports');
const extractPointsStatus = require('../../checker/status/extractPointsStatusCheck');
const generalBalanceStatus = require('../../checker/status/generalBalanceStatusCheck');
const generalBalanceFields = require('../../checker/fields/generalBalanceFieldsCheck');
const { send: sendSendPoints } = endpoints.send_point;


defineFeature(feature, (test) => {
    let userSendData, userReceiveData;
    let userSendCreated;
    let confirmTokenUserSend;
    let bearerTokenUserSend, bearerTokenUserReceive;
    let pointsUserSend, pointsUserReceive;
    let piggyBankSend, piggyBankReceive;
    let balanceSender;

    beforeEach(async () => {
        const user = await methodsSupports.registerUser();
        userSendCreated = user.userCreated;
        confirmTokenUserSend = user.confirmToken;
        userSendData = user.userData;
    });


    test("Transferência de pontos correta", ({ given, when, then, and }) => {
        let response;
        let pointsSender = 47;

        // Aqui vou validar o usuário e retornar seus pontos
        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
        });

        // Aqui vou cadastrar um novo usuário, validar e retornar seus pontos
        and("possuo um usuário recebedor cadastrado e validado", async () => {
            userReceiveData = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(userReceiveData.userCreated);
            await methodsSupports.confirmEmail(userReceiveData.confirmToken);
            const tokenRec = await methodsSupports.loginUser(userReceiveData.userData.email, userReceiveData.userData.password);
            bearerTokenUserReceive = tokenRec;
            const points = await methodsSupports.generalBalance(bearerTokenUserReceive);
            pointsUserReceive = points.body.normal_balance;
            piggyBankReceive = points.body.piggy_bank_balance;
        });

        when("realizo a requisição de envio de pontos corretamente", async () => {
            const send = sendSendPoints(userReceiveData.userData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            pointsFields.sendPointsSuccess(response);
        });

        and("o status da requisição deve ser 200", () => {
            pointsStatus.sendPointsStatusCheck(response);
        });

        and("deve subtrair os pontos enviados da quantidade total do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenUserSend);
            generalBalanceStatus.checkGeneralBalanceSuccess(senderUserBalance);
            generalBalanceFields.verifyValuesPoints(senderUserBalance, pointsUserSend - pointsSender, piggyBankSend);
        });

        and("deve adicionar os pontos recebidos aos pontos já possuídos do usuário de envio", async () => {
            const receiveUserBalance = await utils.generalBalance(bearerTokenUserReceive);
            generalBalanceStatus.checkGeneralBalanceSuccess(receiveUserBalance);
            generalBalanceFields.verifyValuesPoints(receiveUserBalance, pointsUserReceive + pointsSender, piggyBankReceive);
        });

        // Nos dois steps abaixo, não criei uma classe específica para validação pois apenas esse teste iria utilizá-los.
        // Em um cenário real, essas validações poderiam estar em um checker. Inclusive a validação de mais de um extrato.
        and("deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenUserSend);
            balanceSender = extractSender.body;
            extractPointsStatus.extractPointsSuccessCheck(extractSender);
            expect(extractSender.status).toBe(200);
            expect(extractSender.body.length).toBe(1);
            expect(extractSender.body[0]).toHaveProperty('amount');
            expect(extractSender.body[0].amount).toBe(pointsSender);
        });

        and("deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiver = await utils.extractPoints(bearerTokenUserReceive);
            extractPointsStatus.extractPointsSuccessCheck(extractReceiver);
            expect(extractReceiver.body.length).toBe(1);
            //Estou pegando o primeiro elemento do body, pois nesse teste, só deve ter uma transação
            expect(extractReceiver.body[0]).toHaveProperty('amount');
            expect(extractReceiver.body[0].amount).toBe(pointsSender);
            expect(extractReceiver.body[0].id).toBe(balanceSender[0].id);
            expect(extractReceiver.body[0].from_user).toBe(balanceSender[0].from_user);
            expect(extractReceiver.body[0].created_at).toBe(balanceSender[0].created_at);
        });
    }, 90000);

    test("Transferência total de pontos", ({ given, when, then, and }) => {
        let response;
        let pointsSender;

        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
            pointsSender = pointsUserSend;
        });

        and("possuo um usuário recebedor cadastrado e validado", async () => {
            userReceiveData = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(userReceiveData.userCreated);
            await methodsSupports.confirmEmail(userReceiveData.confirmToken);
            const tokenRec = await methodsSupports.loginUser(userReceiveData.userData.email, userReceiveData.userData.password);
            bearerTokenUserReceive = tokenRec;
            const points = await methodsSupports.generalBalance(bearerTokenUserReceive);
            pointsUserReceive = points.body.normal_balance;
            piggyBankReceive = points.body.piggy_bank_balance;
        });

        when("realizo a requisição de envio de todos os pontos disponíveis", async () => {
            const send = sendSendPoints(userReceiveData.userData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            pointsFields.sendPointsSuccess(response);
        });

        and("o status da requisição deve ser 200", () => {
            pointsStatus.sendPointsStatusCheck(response);
        });

        and("deve subtrair todos os pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenUserSend);
            generalBalanceStatus.checkGeneralBalanceSuccess(senderUserBalance);
            generalBalanceFields.verifyValuesPoints(senderUserBalance, pointsUserSend - pointsSender, piggyBankSend);
        });

        and("deve adicionar todos os pontos ao usuário recebedor", async () => {
            const receiveUserBalance = await utils.generalBalance(bearerTokenUserReceive);
            generalBalanceStatus.checkGeneralBalanceSuccess(receiveUserBalance);
            generalBalanceFields.verifyValuesPoints(receiveUserBalance, pointsUserReceive + pointsSender, piggyBankReceive);
        });

        and("deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenUserSend);
            balanceSender = extractSender.body;
            extractPointsStatus.extractPointsSuccessCheck(extractSender);
            expect(extractSender.status).toBe(200);
            expect(extractSender.body.length).toBe(1);
            expect(extractSender.body[0]).toHaveProperty('amount');
            expect(extractSender.body[0].amount).toBe(pointsSender);
        });

        and("deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiver = await utils.extractPoints(bearerTokenUserReceive);
            extractPointsStatus.extractPointsSuccessCheck(extractReceiver);
            expect(extractReceiver.body.length).toBe(1);
            //Estou pegando o primeiro elemento do body, pois nesse teste, só deve ter uma transação
            expect(extractReceiver.body[0]).toHaveProperty('amount');
            expect(extractReceiver.body[0].amount).toBe(pointsSender);
            expect(extractReceiver.body[0].id).toBe(balanceSender[0].id);
            expect(extractReceiver.body[0].from_user).toBe(balanceSender[0].from_user);
            expect(extractReceiver.body[0].created_at).toBe(balanceSender[0].created_at);
        });
    }, 90000);

    test("Transferência de pontos inválida - saldo insuficiente", ({ given, when, then, and }) => {
        let response;
        let pointsSender;

        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
            pointsSender = pointsUserSend + 1; //Adicionando 1 ponto para simular um saldo insuficiente
        });

        and("possuo um usuário recebedor cadastrado e validado", async () => {
            userReceiveData = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(userReceiveData.userCreated);
            await methodsSupports.confirmEmail(userReceiveData.confirmToken);
            const tokenRec = await methodsSupports.loginUser(userReceiveData.userData.email, userReceiveData.userData.password);
            bearerTokenUserReceive = tokenRec;
            const points = await methodsSupports.generalBalance(bearerTokenUserReceive);
            pointsUserReceive = points.body.normal_balance;
            piggyBankReceive = points.body.piggy_bank_balance;
        });

        when("realizo a requisição de envio de pontos com quantidade maior do que a disponível", async () => {
            const send = sendSendPoints(userReceiveData.userData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            pointsFields.verifyInsufficientBalance(response);
        });

        and("o status da requisição deve ser 400", () => {
            pointsStatus.sendPointsFailCheck(response);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenUserSend);
            generalBalanceStatus.checkGeneralBalanceSuccess(senderUserBalance);
            generalBalanceFields.verifyValuesPoints(senderUserBalance, pointsUserSend, piggyBankSend);
        });

        and("não deve adicionar pontos ao usuário recebedor", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenUserReceive);
            generalBalanceStatus.checkGeneralBalanceSuccess(receivedUserBalance);
            generalBalanceFields.verifyValuesPoints(receivedUserBalance, pointsUserReceive, piggyBankReceive);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenUserSend);
            extractPointsStatus.extractPointsSuccessCheck(extractSender);
            expect(extractSender.body.length).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiver = await utils.extractPoints(bearerTokenUserReceive);
            extractPointsStatus.extractPointsSuccessCheck(extractReceiver);
            expect(extractReceiver.body.length).toBe(0);
        });
    }, 90000);

    test("Transferência de pontos inválida = usuário recebedor não está ativo", ({ given, when, then, and }) => {
        let response;
        let pointsSender;
        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
            pointsSender = parseInt(pointsUserSend / 2); // Enviando metade dos pontos disponíveis
        });

        and("possuo um usuário recebedor cadastrado e validado, mas inativo", async () => {
            userReceiveData = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(userReceiveData.userCreated);
            await methodsSupports.confirmEmail(userReceiveData.confirmToken);
            const tokenRec = await methodsSupports.loginUser(userReceiveData.userData.email, userReceiveData.userData.password);
            await methodsSupports.accountUser(userReceiveData.userData.password, tokenRec);
        });

        when("realizo a requisição de envio de pontos para o usuário inativo", async () => {
            const send = sendSendPoints(userReceiveData.userData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            pointsFields.verifyUserDestinationNotFound(response);
        });

        and("o status da requisição deve ser 404", () => {
            pointsStatus.userDestinationNotFoundCheck(response);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenUserSend);
            generalBalanceStatus.checkGeneralBalanceSuccess(senderUserBalance);
            generalBalanceFields.verifyValuesPoints(senderUserBalance, pointsUserSend, piggyBankSend);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenUserSend);
            extractPointsStatus.extractPointsSuccessCheck(extractSender);
            expect(extractSender.body.length).toBe(0);
        });
    }, 90000);

    test("Transferência de pontos inválida - usuário de envio não está ativo", ({ given, when, then, and }) => {
        let response;
        let pointsSender;

        given("que possuo um usuário transferidor cadastrado e validado, mas inativo", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
            pointsSender = parseInt(pointsUserSend / 2); // Enviando metade dos pontos disponíveis
            await methodsSupports.accountUser(userSendData.password, bearerTokenUserSend);
        });

        and("possuo um usuário recebedor cadastrado e validado", async () => {
            userReceiveData = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(userReceiveData.userCreated);
            await methodsSupports.confirmEmail(userReceiveData.confirmToken);
            const tokenRec = await methodsSupports.loginUser(userReceiveData.userData.email, userReceiveData.userData.password);
            bearerTokenUserReceive = tokenRec;
            const points = await methodsSupports.generalBalance(bearerTokenUserReceive);
            pointsUserReceive = points.body.normal_balance;
            piggyBankReceive = points.body.piggy_bank_balance;
        });

        when("realizo a requisição de envio de pontos do usuário inativo para o usuário ativo", async () => {
            const send = sendSendPoints(userReceiveData.userData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("o status da requisição deve ser 404", () => {
            pointsStatus.userDestinationNotFoundCheck(response);
        });

        and("não deve adicionar pontos ao usuário recebedor", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenUserReceive);
            generalBalanceStatus.checkGeneralBalanceSuccess(receivedUserBalance);
            generalBalanceFields.verifyValuesPoints(receivedUserBalance, pointsUserSend, piggyBankSend);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiv = await utils.extractPoints(bearerTokenUserReceive);
            extractPointsStatus.extractPointsSuccessCheck(extractReceiv);
            expect(extractReceiv.body.length).toBe(0);
        });
    }, 90000);

    test("Transferência de pontos inválida - usuário recebedor não existe", ({ given, when, then, and }) => {
        let response;
        let pointsSender;
        let receivingUserData = generator.generateUserValid();

        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            methodsSupports.verifyUserCreated(userSendCreated);
            await methodsSupports.confirmEmail(confirmTokenUserSend);
            const tokenSend = await methodsSupports.loginUser(userSendData.email, userSendData.password);
            bearerTokenUserSend = tokenSend;
            const points = await methodsSupports.generalBalance(bearerTokenUserSend);
            piggyBankSend = points.body.piggy_bank_balance;
            pointsUserSend = points.body.normal_balance;
            pointsSender = parseInt(pointsUserSend / 2); // Enviando metade dos pontos disponíveis
        });

        when("realizo a requisição de envio de pontos para um usuário inexistente", async () => {
            const send = sendSendPoints(receivingUserData.cpf + '1', pointsSender);
            response = await utils.sendPoints(send, bearerTokenUserSend);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            pointsFields.verifyUserDestinationNotFound(response);
        });

        and("o status da requisição deve ser 404", () => {
            pointsStatus.userDestinationNotFoundCheck(response);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenUserSend);
            generalBalanceStatus.checkGeneralBalanceSuccess(senderUserBalance);
            generalBalanceFields.verifyValuesPoints(senderUserBalance, pointsUserSend, piggyBankSend);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenUserSend);
            extractPointsStatus.extractPointsSuccessCheck(extractSender);
            expect(extractSender.body.length).toBe(0);
        });

    }, 90000);
});