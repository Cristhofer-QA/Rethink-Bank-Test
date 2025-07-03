const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Points.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendAccount } = endpoints.account;
const { send: sendLogin } = endpoints.login;
const { send: sendSendPoints } = endpoints.send_point;
const generator = require('../../generators//userGenerator');


defineFeature(feature, (test) => {

    const pointSendedSuccess = 'Pontos enviados com sucesso.';
    const insufficientBalance = 'Saldo insuficiente';
    const userDestinationNotFound = 'Usuário destino não encontrado';


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
            balanceSender = extractSender.body;
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

    test("Transferência total de pontos", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend;
        let pointsUserReceiv;

        let pointsSender;

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
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            if (senderUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserSend = senderUserBalance.body.normal_balance;
            pointsSender = pointsUserSend; // Enviando todos os pontos disponíveis
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

            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            if (receivedUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserReceiv = receivedUserBalance.body.normal_balance;
        });

        when("realizo a requisição de envio de todos os pontos disponíveis", async () => {
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

        and("deve subtrair todos os pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            expect(senderUserBalance.status).toBe(200);
            expect(senderUserBalance.body).toHaveProperty('normal_balance');
            expect(senderUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(senderUserBalance.body.normal_balance).toBe(pointsUserSend - pointsSender);
            expect(senderUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("deve adicionar todos os pontos ao usuário recebedor", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            expect(receivedUserBalance.status).toBe(200);
            expect(receivedUserBalance.body).toHaveProperty('normal_balance');
            expect(receivedUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(receivedUserBalance.body.normal_balance).toBe(pointsUserReceiv + pointsSender);
            expect(receivedUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenSending);
            balanceSender = extractSender.body;
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


    test("Transferência de pontos inválida - saldo insuficiente", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend;
        let pointsUserReceiv;

        let pointsSender;

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
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            if (senderUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserSend = senderUserBalance.body.normal_balance;
            pointsSender = pointsUserSend + 1; // Enviando mais pontos do que o disponível
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

            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            if (receivedUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserReceiv = receivedUserBalance.body.normal_balance;
        });

        when("realizo a requisição de envio de pontos com quantidade maior do que a disponível", async () => {
            const send = sendSendPoints(receivingUserData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenSending);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(insufficientBalance);
        });

        and("o status da requisição deve ser 400", () => {
            expect(response.status).toBe(400);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            expect(senderUserBalance.status).toBe(200);
            expect(senderUserBalance.body).toHaveProperty('normal_balance');
            expect(senderUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(senderUserBalance.body.normal_balance).toBe(pointsUserSend);
            expect(senderUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("não deve adicionar pontos ao usuário recebedor", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            expect(receivedUserBalance.status).toBe(200);
            expect(receivedUserBalance.body).toHaveProperty('normal_balance');
            expect(receivedUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(receivedUserBalance.body.normal_balance).toBe(pointsUserReceiv);
            expect(receivedUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenSending);
            balanceSender = extractSender.body;
            expect(extractSender.status).toBe(200);
            expect(extractSender.body.length).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiver = await utils.extractPoints(bearerTokenReceiving);
            expect(extractReceiver.status).toBe(200);
            expect(extractReceiver.body.length).toBe(0);
        });
    }, 90000);

    test("Transferência de pontos inválida = usuário recebedor não está ativo", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend;

        let pointsSender;

        let bearerTokenSending, bearerTokenReceiving;

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
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            if (senderUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserSend = senderUserBalance.body.normal_balance;
            pointsSender = parseInt(pointsUserSend) / 2; // Enviando metade dos pontos disponíveis
        });

        and("possuo um usuário recebedor cadastrado e validado, mas inativo", async () => {
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

            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            if (receivedUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserReceiv = receivedUserBalance.body.normal_balance;

            // Inativando o usuário recebedor
            const sendInactiveUser = sendAccount(receivingUserData.password);
            const inactivateUser = await utils.account(sendInactiveUser, bearerTokenReceiving);

            if (inactivateUser.status !== 200) {
                throw new Error('Usuário recebedor não inativado, cenário ignorado');
            }
        });

        when("realizo a requisição de envio de pontos para o usuário inativo", async () => {
            const send = sendSendPoints(receivingUserData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenSending);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(userDestinationNotFound);
        });

        and("o status da requisição deve ser 404", () => {
            expect(response.status).toBe(404);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            expect(senderUserBalance.status).toBe(200);
            expect(senderUserBalance.body).toHaveProperty('normal_balance');
            expect(senderUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(senderUserBalance.body.normal_balance).toBe(pointsUserSend);
            expect(senderUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractSender = await utils.extractPoints(bearerTokenSending);
            balanceSender = extractSender.body;
            expect(extractSender.status).toBe(200);
            expect(extractSender.body.length).toBe(0);
        });

    }, 90000);

    test("Transferência de pontos inválida - usuário de envio não está ativo", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend;

        let pointsSender;

        let bearerTokenSending, bearerTokenReceiving;

        given("que possuo um usuário transferidor cadastrado e validado, mas inativo", async () => {
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
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            if (senderUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserSend = senderUserBalance.body.normal_balance;
            pointsSender = parseInt(pointsUserSend) / 2; // Enviando metade dos pontos disponíveis

            // Inativando o usuário transferidor
            const sendInactiveUser = sendAccount(sendingUserData.password);
            const inactivateUser = await utils.account(sendInactiveUser, bearerTokenSending);

            if (inactivateUser.status !== 200) {
                throw new Error('Usuário transferidor não inativado, cenário ignorado');
            }
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

            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            if (receivedUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserReceiv = receivedUserBalance.body.normal_balance;

        });

        when("realizo a requisição de envio de pontos do usuário inativo para o usuário ativo", async () => {
            const send = sendSendPoints(receivingUserData.cpf, pointsSender);
            response = await utils.sendPoints(send, bearerTokenSending);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(userDestinationNotFound);
        });

        and("o status da requisição deve ser 404", () => {
            expect(response.status).toBe(404);
        });

        and("não deve adicionar pontos ao usuário recebedor", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenReceiving);
            expect(receivedUserBalance.status).toBe(200);
            expect(receivedUserBalance.body).toHaveProperty('normal_balance');
            expect(receivedUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(receivedUserBalance.body.normal_balance).toBe(pointsUserSend);
            expect(receivedUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário recebedor", async () => {
            const extractReceiv = await utils.extractPoints(bearerTokenReceiving);
            balanceSender = extractReceiv.body;
            expect(extractReceiv.status).toBe(200);
            expect(extractReceiv.body.length).toBe(0);
        });

    }, 90000);

    test("Transferência de pontos inválida - usuário recebedor não existe", ({ given, when, then, and }) => {
        let response;

        let sendingUserData = generator.generateUserValid();
        let receivingUserData = generator.generateUserValid();

        let pointsUserSend;

        let pointsSender;

        let bearerTokenSending, bearerTokenReceiving;

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
            const senderUserBalance = await utils.generalBalance(bearerTokenSending);
            if (senderUserBalance.status !== 200) {
                throw new Error('Erro ao validar saldo inicial do usuário, cenário ignorado');
            };
            pointsUserSend = senderUserBalance.body.normal_balance;
            pointsSender = parseInt(pointsUserSend) / 2; // Enviando metade dos pontos disponíveis

        });

        when("realizo a requisição de envio de pontos para um usuário inexistente", async () => {
            const send = sendSendPoints(receivingUserData.cpf + '1', pointsSender);
            response = await utils.sendPoints(send, bearerTokenSending);
        });

        then("a requisição deve retornar uma mensagem de erro", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(userDestinationNotFound);
        });

        and("o status da requisição deve ser 404", () => {
            expect(response.status).toBe(404);
        });

        and("não deve subtrair pontos do usuário de envio", async () => {
            const receivedUserBalance = await utils.generalBalance(bearerTokenSending);
            expect(receivedUserBalance.status).toBe(200);
            expect(receivedUserBalance.body).toHaveProperty('normal_balance');
            expect(receivedUserBalance.body).toHaveProperty('piggy_bank_balance');
            expect(receivedUserBalance.body.normal_balance).toBe(pointsUserSend);
            expect(receivedUserBalance.body.piggy_bank_balance).toBe(0);
        });

        and("não deve gerar um histórico de transação de pontos para o usuário de envio", async () => {
            const extractReceiv = await utils.extractPoints(bearerTokenSending);
            balanceSender = extractReceiv.body;
            expect(extractReceiv.status).toBe(200);
            expect(extractReceiv.body.length).toBe(0);
        });

    }, 90000);


});