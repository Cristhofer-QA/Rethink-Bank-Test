const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/RegisterUser.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;
const generator = require('../../generators/baseGenerator');
const featureVar = require('../../variables/featuresVariables')


defineFeature(feature, (test) => {
    const successRegistrationMessage = 'Cadastro realizado com sucesso.';
    const cpfInvalidMessage = 'CPF inválido';
    const passwordInvalidMessage = 'Senha fraca';
    const fullNameInvalidMessage = 'Nome completo obrigatório';
    const emailInvalidMessage = 'Email inválido';
    const cpfAlreadyRegisteredMessage = 'duplicate key value violates unique constraint \"users_cpf_key\"';
    const passwordConfirmInvalidMessage = 'Senhas não conferem';
    const emailAlreadyRegisteredMessage = 'duplicate key value violates unique constraint \"users_email_key\"';

    test("Cadastro com dados válidos", ({ given, when, then, and }) => {
        let send, response;
        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        given("que possuo todos os dados para o cadastro de usuário", () => {
            send = sendRegister(cpf, fullName, email, password, confirmPassword);
        });

        when("realizo a requisição de cadastro com todos os dados válidos", async () => {
            response = await utils.registerUser(send);
        });

        then("a resposta deve conter a mensagem de cadastro com sucesso", () => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe(successRegistrationMessage);
        });

        and("a resposta deve conter o campo confirmToken", () => {
            expect(response.body).toHaveProperty('confirmToken');
            expect(response.body.confirmToken).not.toBeNull();
        });

        and("o status da resposta deve ser 201", () => {
            expect(response.status).toBe(201);
        });

    });

    test("Cadastro com CPF já cadastrado", ({ given, when, then, and }) => {
        let send, response;
        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        const cpfAlreadyRegistered = cpf;
        const fullNameAlreadyRegistered = generator.generateName(featureVar.fullNameValid);
        const emailAlreadyRegistered = generator.generateEmail(featureVar.emailValid);
        const passwordAlreadyRegistered = generator.generatePassword(featureVar.emailValid);
        const confirmPasswordAlreadyRegistered = passwordAlreadyRegistered;

        given("que eu possua o CPF de um usuário já cadastrado", async () => {
            const sendAlreadyRegistered = sendRegister(
                cpfAlreadyRegistered,
                fullNameAlreadyRegistered,
                emailAlreadyRegistered,
                passwordAlreadyRegistered,
                confirmPasswordAlreadyRegistered
            );
            const res = await utils.registerUser(sendAlreadyRegistered);
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!.")
            }
            send = sendRegister(cpf, fullName, email, password, confirmPassword);
        });

        when("realizo a requisição de cadastro informando o CPF já cadastrado", async () => {
            response = await utils.registerUser(send);
        });

        then("deve retornar uma responta informando que CPF já está cadastrado", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(cpfAlreadyRegisteredMessage);
        });

        and("o status da resposta deve ser 400 para o CPF já está cadastrado", () => {
            expect(response.status).toBe(400);
        });
    });

    test("Cadastro com email já cadastrado", ({ given, when, then, and }) => {
        let send, response;
        const cpf = generator.generateCpf(featureVar.cpfValid);
        const fullName = generator.generateName(featureVar.fullNameValid);
        const email = generator.generateEmail(featureVar.emailValid);
        const password = generator.generatePassword(featureVar.emailValid);
        const confirmPassword = password;

        const cpfAlreadyRegistered = generator.generateCpf(featureVar.cpfValid);
        const fullNameAlreadyRegistered = generator.generateName(featureVar.fullNameValid);
        const emailAlreadyRegistered = email;
        const passwordAlreadyRegistered = generator.generatePassword(featureVar.emailValid);
        const confirmPasswordAlreadyRegistered = passwordAlreadyRegistered;

        given("que eu possua o email de um usuário já cadastrado", async () => {
            const sendAlreadyRegistered = sendRegister(
                cpfAlreadyRegistered,
                fullNameAlreadyRegistered,
                emailAlreadyRegistered,
                passwordAlreadyRegistered,
                confirmPasswordAlreadyRegistered
            );
            const res = await utils.registerUser(sendAlreadyRegistered);
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!.")
            }
            send = sendRegister(cpf, fullName, email, password, confirmPassword);
        });

        when("realizo a requisição de cadastro informando o email já cadastrado", async () => {
            response = await utils.registerUser(send);
        });

        then("deve retornar uma responta informando que email já está cadastrado", () => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(emailAlreadyRegisteredMessage);
        });

        and("o status da resposta deve ser 400 para o email já está cadastrado", () => {
            expect(response.status).toBe(400);
        });
    });


    test("Cadastro com CPF inválido - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com CPF inválido$/, (cpfPlaceholder, fullNamePlaceholder, emailPlaceholder, passwordPlaceholder) => {
            const cpf = generator.generateCpf(cpfPlaceholder);
            const email = generator.generateEmail(emailPlaceholder);
            const fullName = generator.generateName(fullNamePlaceholder);
            const password = generator.generatePassword(passwordPlaceholder);

            send = sendRegister(cpf, fullName, email, password, password);
            console.log(send)
        });

        when("realizo a requisição de cadastro com o CPF inválido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o CPF inválido", () => {
            expect(response.body).not.toHaveProperty('confirmToken');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(cpfInvalidMessage);
        });

        and("o status da resposta deve ser 400 para o CPF inválido", () => {
            expect(response.status).toBe(400);
        });
    });

    test("Cadastro com full_name invalido - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com Full Name inválido$/, (cpfPlaceholder, fullNamePlaceholder, emailPlaceholder, passwordPlaceholder) => {
            const cpf = generator.generateCpf(cpfPlaceholder);
            const email = generator.generateEmail(emailPlaceholder);
            const fullName = generator.generateName(fullNamePlaceholder);
            const password = generator.generatePassword(passwordPlaceholder);
            send = sendRegister(cpf, fullName, email, password, password);
            console.log(send);
        });

        when("realizo a requisição de cadastro com o full_name invalido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o full_name invalido", () => {
            expect(response.body).not.toHaveProperty('confirmToken');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(fullNameInvalidMessage);
        });

        and("o status da resposta deve ser 400 para o full_name invalido", () => {
            expect(response.status).toBe(400);
        });
    });

    test("Cadastro com email invalido - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com email inválido$/, (cpfPlaceholder, fullNamePlaceholder, emailPlaceholder, passwordPlaceholder) => {
            const cpf = generator.generateCpf(cpfPlaceholder);
            const email = generator.generateEmail(emailPlaceholder);
            const fullName = generator.generateName(fullNamePlaceholder);
            const password = generator.generatePassword(passwordPlaceholder);
            send = sendRegister(cpf, fullName, email, password, password);
            console.log(send);
        });

        when("realizo a requisição de cadastro com o full_name invalido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o full_name invalido", () => {
            expect(response.body).not.toHaveProperty('confirmToken');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(emailInvalidMessage);
        });

        and("o status da resposta deve ser 400 para o full_name invalido", () => {
            expect(response.status).toBe(400);
        });
    });

    test("Cadastro com senha inválida - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com senha inválida$/, (cpfPlaceholder, fullNamePlaceholder, emailPlaceholder, passwordPlaceholder) => {
            const cpf = generator.generateCpf(cpfPlaceholder);

            const email = generator.generateEmail(emailPlaceholder);

            const fullName = generator.generateName(fullNamePlaceholder);
            const password = generator.generatePassword(passwordPlaceholder);

            send = sendRegister(cpf, fullName, email, password, password);

            console.log(passwordPlaceholder)
            console.log(send)
        });

        when("realizo a requisição de cadastro com senha inválida", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro com senha inválida", () => {
            expect(response.body).not.toHaveProperty('confirmToken');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(passwordInvalidMessage);
        });

        and("o status da resposta deve ser 400 com senha inválida", () => {
            expect(response.status).toBe(400);
        });
    });


    test("Cadastro com confirmação de senha inválida - <scenario>", ({ given, when, then, and }) => {
        let send, response;
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com confirmação de senha inválida$/, (cpfPlaceholder, fullNamePlaceholder, emailPlaceholder, passwordPlaceholder, passwordConfirmPlaceholder) => {
            const cpf = generator.generateCpf(cpfPlaceholder);

            const email = generator.generateEmail(emailPlaceholder);

            const fullName = generator.generateName(fullNamePlaceholder);
            const password = generator.generatePassword(passwordPlaceholder);
            const passwordConfirm = generator.returnPasswordConfirm(passwordConfirmPlaceholder, password);

            send = sendRegister(cpf, fullName, email, password, passwordConfirm);

            console.log(send)
        });

        when("realizo a requisição de cadastro com confirmação de senha inválida", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro com confirmação de senha inválida", () => {
            expect(response.body).not.toHaveProperty('confirmToken');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(passwordConfirmInvalidMessage);
        });

        and("o status da resposta deve ser 400 com confirmação de senha inválida", () => {
            expect(response.status).toBe(400);
        });
    });

});