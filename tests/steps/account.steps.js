const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/Account.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const { send: sendLogin } = endpoints.login;
const { send: sendAccount } = endpoints.account;
const userGenerator = require('../../generators/userGenerator');

defineFeature(feature, (test) => {

    let userCreated = null;
    let confirmToken = null;
    let userData;

    const accountSuccessMessage = 'Conta marcada como deletada.';
    const invalidPasswordMessage = 'Senha inválida';
    const unauthorizedMessage = 'Não autorizado';

    beforeEach(async () => {
        userData = userGenerator.generateUserValid();
        const sent = sendRegister(
            userData.cpf,
            userData.fullName,
            userData.email,
            userData.password,
            userData.confirmPassword
        )

        try {
            const res = await utils.registerUser(sent);
            userCreated = res.status === 201;

            confirmToken = res.body.confirmToken;
        } catch {
            userCreated = false;
        }
    });


    test("Exclusão correta de conta", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, informando a senha correta para esse usuário", async () => {
            send = sendAccount(userData.password);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de sucesso", () => {
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toBe(accountSuccessMessage);
        });

        and("o status da resposta deve ser 200", () => {
            expect(response.status).toBe(200);
        });

    });

    test("Exclusão de conta informando senha inválida", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, informando uma senha incorreta para esse usuário", async () => {
            send = sendAccount(userData.password.toLowerCase());
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toBe(invalidPasswordMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Exclusão de conta não informando senha", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, informando uma senha vazia", async () => {
            send = sendAccount("");
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toBe(invalidPasswordMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Exclusão de conta informando senha nula", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, informando uma senha nula", async () => {
            send = sendAccount(null);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toBe(invalidPasswordMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Exclusão de conta informando senha de outro usuário", ({ given, when, then, and }) => {
        let send, response, bearerToken, newUserPassword;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        and("possuo a senha de outro usuário cadastrado e validado", async () => {

            const newUser = userGenerator.generateUserValid()

            const senNewUser = sendRegister(
                newUser.cpf,
                newUser.fullName,
                newUser.email,
                newUser.password,
                newUser.confirmPassword
            );
            const resNewUser = await utils.registerUser(senNewUser);

            if (resNewUser.status !== 201) {
                throw new Error('Email não foi validado, cenário ignorado');
            };

            newUserPassword = newUser.password;

        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, informando uma senha de um outro usuário", async () => {
            send = sendAccount(newUserPassword);
            response = await utils.account(send, bearerToken);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toBe(invalidPasswordMessage);
        });

        and("o status da resposta deve ser 400", () => {
            expect(response.status).toBe(400);
        });

    });

    test("Exclusão de conta não informando o bearer token", ({ given, when, then, and }) => {
        let send, response, bearerToken;

        given("que tenha um usuário cadastrado com um e-mail já confirmado", async () => {
            if (!userCreated) {
                throw new Error('Usuário não foi criado, cenário ignorado');
            };

            const res = await utils.confirmEmail(confirmToken);

            if (res.status !== 200) {
                throw new Error('Email não foi validado, cenário ignorado');
            };
        });

        when("logo no sistema com esse usuário", async () => {
            send = sendLogin(userData.email, userData.password);
            response = await utils.login(send);
            if (response.status !== 200) {
                throw new Error('Login não efetuado. Cenário ignorado.');
            };

            bearerToken = response.body.token;
        });

        and("realizo a requisição de exclusão de conta, com dados corretos, mas sem bearer token", async () => {
            send = sendAccount(userData.password);
            response = await utils.account(send, null);
        });

        then("a resposta deve conter uma mensagem de erro", () => {
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toBe(unauthorizedMessage);
        });

        and("o status da resposta deve ser 401", () => {
            expect(response.status).toBe(401);
        });

    });
});