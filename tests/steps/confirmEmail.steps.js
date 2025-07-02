const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/ConfirmEmail.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const featureVar = require('../../variables/featuresVariables');
const generator = require('../../generators/baseGenerator');


defineFeature(feature, (test) => {
    const confirmEmailSuccessMessage = 'E-mail confirmado com sucesso.';
    const confirmTokenExpiredMessage = 'Token inválido ou expirado.';

    test("Confirmação correta de e-mail", ({ given, when, then, and }) => {
        let response, token;

        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        given('que tenho um usuário cadastrado que não possua e-mail confirmado', async () => {
            const sendRes = sendRegister(cpf, fullName, email, password, confirmPassword);
            const res = await utils.registerUser(sendRes)
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!.")
            };

            token = res.body.confirmToken;
        });

        when('realizo a requisição de confirmar e-mail para o usuário que não foi confirmado', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da resposta deve ser 200 (para a confirmação do e-mail ainda não confirmado)', () => {
            expect(response.status).toBe(200);
        });

        and('a resposta deve apresentar a mensagem de confirmação (do e-mail ainda não confirmado)', () => {
            expect(response.text).toBe(confirmEmailSuccessMessage);
        });

    });

    test("Confirmar um e-mail já confirmado", ({ given, when, then, and }) => {
        let responseConfirm, token;

        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        given('que tenha um usuário cadastrado com um e-mail já confirmado', async () => {
            const sendRes = sendRegister(cpf, fullName, email, password, confirmPassword);
            const res = await utils.registerUser(sendRes)
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!")
            };
            token = res.body.confirmToken;
            const response = await utils.confirmEmail(token);
            if (response.status !== 200) {
                throw new Error("Não foi possível continuar o cenário, pois a primeira confirmação de e-mail falhou!")
            };
        });

        when('realizo a requisição de confirmar e-mail para o usuário que já foi confirmado', async () => {
            responseConfirm = await utils.confirmEmail(token);
        });

        then('o status da responta deve ser 200 (para a confirmação já realizada)', () => {
            expect(responseConfirm.status).toBe(200);
        });

        and('a resposta deve apresentar a mensagem de confirmação (para a confirmação já realizada)', () => {
            expect(responseConfirm.text).toBe(confirmEmailSuccessMessage);
        });

    });

    test("Confirmar um e-mail com um token inválido", ({ given, when, then, and }) => {
        let response, token;

        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        given('que tenha um usuário cadastrado e com o token retornado', async () => {
            const sendRes = sendRegister(cpf, fullName, email, password, confirmPassword);
            const res = await utils.registerUser(sendRes)
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!")
            };
            token = res.body.confirmToken + 'err';
        });

        when('realizo a requisição de confirmar e-mail informando um token incorreto', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da responta deve ser 400 (para a confirmação com token incorreto)', () => {
            expect(response.status).toBe(400);
        });

        and('a resposta não deve apresentar a mensagem de confirmação (para a confirmação com token incorreto)', () => {
            expect(response.text).toBe(confirmTokenExpiredMessage);
        });
    });

    test("Confirmar um e-mail sem token", ({ given, when, then, and }) => {
        let response;

        const token = null;
        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        given('que tenha um usuário cadastrado e com o token retornado (validação sem token)', async () => {
            const sendRes = sendRegister(cpf, fullName, email, password, confirmPassword);
            const res = await utils.registerUser(sendRes)
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!")
            };
        });

        when('realizo a requisição de confirmar e-mail não informando um token', async () => {
            response = await utils.confirmEmail(token);
        });

        then('o status da responta deve ser 400 (para a confirmação sem token)', () => {
            expect(response.status).toBe(400);
        });

        and('a resposta não deve apresentar a mensagem de confirmação (para a confirmação sem token)', () => {
            expect(response.text).toBe(confirmTokenExpiredMessage);
        });
    });
});