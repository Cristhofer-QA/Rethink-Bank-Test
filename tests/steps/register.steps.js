const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/RegisterUser.feature"));
const utils = require('../../support/utils');
const endpoints = require('../../support/endpoints');
const { send: sendRegister } = endpoints.register;


defineFeature(feature, (test) => {
    const registerSuccess = require('../../variables/register/registerUserSuccessVariable');
    const registerCpfAlreadyRegistered = require('../../variables/register/registerUserCpfAlreadyRegisteredVariable');
    const registerEmailAlreadyRegistered = require('../../variables/register/registerUserEmailAlreadyRegisteredVariable');

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
        const cnpj = registerSuccess.cpf;
        const fullName = registerSuccess.full_name;
        const email = registerSuccess.email;
        const password = registerSuccess.password;
        const confirmPassword = password;

        given("que possuo todos os dados para o cadastro de usuário", () => {
            send = sendRegister(cnpj, fullName, email, password, confirmPassword);
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
        const cnpj = registerCpfAlreadyRegistered.cpf;
        const fullName = registerCpfAlreadyRegistered.fullName;
        const email = registerCpfAlreadyRegistered.email;
        const password = registerCpfAlreadyRegistered.password;
        const confirmPassword = password;

        const cnpjAlreadyRegistered = registerCpfAlreadyRegistered.cpf;
        const fullNameAlreadyRegistered = registerCpfAlreadyRegistered.fullNameUserAlreadyRegistered;
        const emailAlreadyRegistered = registerCpfAlreadyRegistered.emailUserAlreadyRegistered;
        const passwordAlreadyRegistered = registerCpfAlreadyRegistered.passwordUserAlreadyRegistered;
        const confirmPasswordAlreadyRegistered = passwordAlreadyRegistered;

        given("que eu possua o CPF de um usuário já cadastrado", async () => {
            const sendAlreadyRegistered = sendRegister(
                cnpjAlreadyRegistered,
                fullNameAlreadyRegistered,
                emailAlreadyRegistered,
                passwordAlreadyRegistered,
                confirmPasswordAlreadyRegistered
            );
            const res = await utils.registerUser(sendAlreadyRegistered);
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!.")
            }
            send = sendRegister(cnpj, fullName, email, password, confirmPassword);
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
        const cnpj = registerEmailAlreadyRegistered.cpf;
        const fullName = registerEmailAlreadyRegistered.fullName;
        const email = registerEmailAlreadyRegistered.email;
        const password = registerEmailAlreadyRegistered.password;
        const confirmPassword = password;

        const cnpjAlreadyRegistered = registerEmailAlreadyRegistered.cpfUserAlreadyRegistered;
        const fullNameAlreadyRegistered = registerEmailAlreadyRegistered.fullNameUserAlreadyRegistered;
        const emailAlreadyRegistered = registerEmailAlreadyRegistered.email;
        const passwordAlreadyRegistered = registerEmailAlreadyRegistered.passwordUserAlreadyRegistered;
        const confirmPasswordAlreadyRegistered = passwordAlreadyRegistered;

        given("que eu possua o email de um usuário já cadastrado", async () => {
            const sendAlreadyRegistered = sendRegister(
                cnpjAlreadyRegistered,
                fullNameAlreadyRegistered,
                emailAlreadyRegistered,
                passwordAlreadyRegistered,
                confirmPasswordAlreadyRegistered
            );
            const res = await utils.registerUser(sendAlreadyRegistered);
            if (res.status !== 201) {
                throw new Error("Não foi possível continuar o cenário, pois o cadastro do usuário falhou!.")
            }
            send = sendRegister(cnpj, fullName, email, password, confirmPassword);
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
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com CPF inválido$/, (cpf, full_name, email, password, confirm_password) => {
            send = sendRegister(cpf, full_name, email, password, confirm_password);
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
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com Full Name inválido$/, (cpf, full_name, email, password, confirm_password) => {
            send = sendRegister(cpf, full_name, email, password, confirm_password);
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
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com email inválido$/, (cpf, full_name, email, password, confirm_password) => {
            send = sendRegister(cpf, full_name, email, password, confirm_password);
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
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com senha inválida$/, (cpf, full_name, email, password, confirm_password) => {
            send = sendRegister(cpf, full_name, email, password, confirm_password);
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
        given(/^que possuo os dados "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" e "([^"]*)" pra cadastro com confirmação de senha inválida$/, (cpf, full_name, email, password, confirm_password) => {
            send = sendRegister(cpf, full_name, email, password, confirm_password);
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