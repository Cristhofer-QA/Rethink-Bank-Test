const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Points.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const { send: sendSendPoints } = endpoints.send_point;
const generator = require('../../generators//userGenerator');


defineFeature(feature, (test) => {

    const pointSendedSuccess = 'Pontos enviados com sucesso.';

    test("Transferência de pontos correta", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend = 100;
        let pointsUserReceiv = 100;

        let pointsSender = 47;

        let bearerTokenSending, bearerTokenReceiving;

        let balanceSender;

        given("que possuo um usuário transferidor cadastrado e validado, com pontos", async () => {
            const sendUserSen = sendRegister(
                sendingUserData.cpf,
                sendingUserData.fullName,
                sendingUserData.email,
                sendingUserData.password,
                sendingUserData.confirmPassword
            );

            const res = await utils.registerUser(sendUserSen);

            if (res.status !== 201) {
                throw new Error('Usuário transferidor não cadastrado, cenário ignorado');
            };

            const confirmToken = res.body.confirmToken;

            const resValid = await utils.confirmEmail(confirmToken);

            if (resValid.status !== 200) {
                throw new Error('Email do usuário transferidor não validado, cenário ignorado');
            };


            const sendUserLogin = sendLogin(sendingUserData.email, sendingUserData.password);
            const respLogin = await utils.login(sendUserLogin);

            if (respLogin.status !== 200) {
                throw new Error('Usuário transferidor não logado, cenário ignorado');
            }

            bearerTokenSending = respLogin.body.token;

        });

        and("possuo um usuário recebedor cadastrado e validado", async () => {
            const sendUserSen = sendRegister(
                receivingUserData.cpf,
                receivingUserData.fullName,
                receivingUserData.email,
                receivingUserData.password,
                receivingUserData.confirmPassword
            );

            const res = await utils.registerUser(sendUserSen);

            if (res.status !== 201) {
                throw new Error('Usuário recebedor não cadastrado, cenário ignorado');
            };

            const confirmToken = res.body.confirmToken;

            const resValid = await utils.confirmEmail(confirmToken);

            if (resValid.status !== 200) {
                throw new Error('Email do usuário recebedor não validado, cenário ignorado');
            };

            const receivedUserLogin = sendLogin(receivingUserData.email, receivingUserData.password);
            const respLoginReceiving = await utils.login(receivedUserLogin);
            if (respLoginReceiving.status !== 200) {
                throw new Error('Usuário recebedor não logado, cenário ignorado');
            }


            bearerTokenReceiving = respLoginReceiving.body.token;
        });

        when("realizo a requisição de envio de pontos corretamente", async () => {
            const send = sendSendPoints(receivingUserData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenSending);
        });

        then("a requisição deve retornar uma mensagem de confirmação", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(pointSendedSuccess);
        });

        and("o status da requisição deve ser 200", () => {
            expect(response.status).toBe(200);
        });

        and("deve subtrair os pontos enviados da quantidade total do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            expect(senderUserBalance.status).toBe(200);
            expect(senderUserBalance.body).toHaveProperty('normal_balance');
            expect(senderUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(senderUserBalance.body.normal_balance).toBe(pointsUserSend - pointsSender);
            expect(senderUserBalance.body.piggy_bank_balance).toBe(0);



        });

        and("deve adicionar os pontos recebidos aos pontos já possuídos do usuário de envio", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            expect(receivedUserBalance.status).toBe(200);
            expect(receivedUserBalance.body).toHaveProperty('normal_balance');
            expect(receivedUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(receivedUserBalance.body.normal_balance).toBe(pointsUserReceiv + pointsSender);
            expect(receivedUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenSending);
            console.log(extractSender.body);
            balanceSender = extractSender.body;
            console.log(balanceSender);
            expect(extractSender.status).toBe(200);
            expect(extractSender.body.length).toBe(1);
            expect(extractSender.body[0]).toHaveProperty('amount');
            expect(extractSender.body[0].amount).toBe(pointsSender);
        });

        and("deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiver = await utils.extractPoints(bearerTokenReceiving);
            expect(extractReceiver.status).toBe(200);
            expect(extractReceiver.body.length).toBe(1);
            //Estou pegando o primeiro elemento do body, pois nesse teste, só deve ter uma transação
            expect(extractReceiver.body[0]).toHaveProperty('amount');
            expect(extractReceiver.body[0].amount).toBe(pointsSender);
            expect(extractReceiver.body[0].id).toBe(balanceSender[0].id);
            expect(extractReceiver.body[0].from_user).toBe(balanceSender[0].from_user);
            expect(extractReceiver.body[0].created_at).toBe(balanceSender[0].created_at);
        });
    }, 90000);






    // test("", ({ given, when, then, and }) => {


    //     given("", () => {

    //     });

    //     when("", async () => {

    //     });

    //     then("", () => {

    //     });

    //     and("", () => {

    //     });

    //     and("", () => {
    //     });

    //     and("", () => {
    //     });

    // });



});