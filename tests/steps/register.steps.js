const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const utils = require('../../support/utils');
const feature = loadFeature(path.resolve(__dirname, "../feature/individual/RegisterUser.feature"));
const endpoints = require('../../support/endpoints');
const generator = require('../../generators/baseGenerator');
const userGenerator = require('../../generators/userGenerator');
const methodsSupports = require('../../support/methodsSupports');
const registerStatus = require('../../checker/status/registerStatusCheck');
const registerFields = require('../../checker/fields/registerFieldsCheck');
const generalBalanceFields = require('../../checker/fields/generalBalanceFieldsCheck');
const generalBalanceStatus = require('../../checker/status/generalBalanceStatusCheck');
const { send: sendRegister } = endpoints.register;

defineFeature(feature, (test) => {

    test("Cadastro com dados válidos", ({ given, when, then, and }) => {
        let send, response;
        const user = userGenerator.generateUserValid();

        given("que possuo todos os dados para o cadastro de usuário", () => {
            send = sendRegister(user.cpf, user.fullName, user.email, user.password, user.confirmPassword);
        });

        when("realizo a requisição de cadastro com todos os dados válidos", async () => {
            response = await utils.registerUser(send);
        });

        then("a resposta deve conter a mensagem de cadastro com sucesso e um confirmToken", () => {
            registerFields.checkRegisterSuccess(response);
        });

        and("o status da resposta deve ser 201", () => {
            registerStatus.checkRegisterSuccess(response);
        });
    });

    test("Cadastro de usuário corretamente e verificação dos 100 pontos iniciais", ({ given, when, then, and }) => {
        let response, bearerToken;

        //Aqui, vou cadastrar, validar e-mail e fazer login com o usuário
        given("que possua um usuário cadastrado e confirmado o email", async () => {
            const registerUser = await methodsSupports.registerUser();
            methodsSupports.verifyUserCreated(registerUser.userCreated);
            await methodsSupports.confirmEmail(registerUser.confirmToken);
            const user = registerUser.userData;
            bearerToken = await methodsSupports.loginUser(user.email, user.password);
        });

        when("consulto o saldo geral dele", async () => {
            response = await utils.generalBalance(bearerToken);
        });

        then("a consulta deve retornar 100 pontos como resultado", () => {
            generalBalanceFields.verifyValuesPoints(response, 100, 0);
        });

        and("o status da consulta deve ser 200", () => {
            generalBalanceStatus.checkGeneralBalanceSuccess(response);
        });
    });

    test("Cadastro com CPF já cadastrado", ({ given, when, then, and }) => {
        let send, response, cpfCadastrado;

        given("que eu possua o CPF de um usuário já cadastrado", async () => {
            // Nesse bloco, vou criar um novo usuário e confirmar o e-mail 
            const user = await methodsSupports.registerUser();
            const userCreated = user.userCreated;
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(user.confirmToken);
            cpfCadastrado = user.userData.cpf;
        });

        when("realizo a requisição de cadastro informando o CPF já cadastrado", async () => {
            const newUser = userGenerator.generateUserValid();
            newUser.cpf = cpfCadastrado;
            send = sendRegister(newUser.cpf, newUser.fullName, newUser.email, newUser.password, newUser.confirmPassword);
            response = await utils.registerUser(send);
        });

        then("deve retornar uma responta informando que CPF já está cadastrado", () => {
            registerFields.cpfAlreadyRegisteredCheck(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
        });
    });

    test("Cadastro com CPF já cadastrado, mas com email não validado", ({ given, when, then, and }) => {
        let send, response, cpfCadastrado;

        given("que eu possua o CPF de um usuário ja cadastrado, mas com email nao validado", async () => {
            // Nesse bloco, vou criar um novo usuário mas não confirmar o e-mail
            const user = await methodsSupports.registerUser();
            const userCreated = user.userCreated;
            methodsSupports.verifyUserCreated(userCreated);
            cpfCadastrado = user.userData.cpf;
        });

        when("realizo a requisição de cadastro informando o CPF ja cadastrado", async () => {
            const newUser = userGenerator.generateUserValid();
            newUser.cpf = cpfCadastrado;
            send = sendRegister(newUser.cpf, newUser.fullName, newUser.email, newUser.password, newUser.confirmPassword);
            response = await utils.registerUser(send);
        });

        then("deve retornar uma responta informando que CPF ja esta cadastrado", () => {
            registerFields.cpfAlreadyRegisteredCheck(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
        });
    });

    test("Cadastro com email já cadastrado", ({ given, when, then, and }) => {
        let send, response, emailCadastrado;

        given("que eu possua o email de um usuário já cadastrado", async () => {
            // Nesse bloco, vou criar um novo usuário e confirmar o e-mail 
            const user = await methodsSupports.registerUser();
            const userCreated = user.userCreated;
            methodsSupports.verifyUserCreated(userCreated);
            await methodsSupports.confirmEmail(user.confirmToken);
            emailCadastrado = user.userData.email;
        });

        when("realizo a requisição de cadastro informando o email já cadastrado", async () => {
            const newUser = userGenerator.generateUserValid();
            newUser.email = emailCadastrado;
            send = sendRegister(newUser.cpf, newUser.fullName, newUser.email, newUser.password, newUser.confirmPassword);
            response = await utils.registerUser(send);
        });

        then("deve retornar uma responta informando que email já está cadastrado", () => {
            registerFields.emailAlreadyRegisteredCheck(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
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
        });

        when("realizo a requisição de cadastro com o CPF inválido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o CPF inválido", () => {
            registerFields.verifyNotToken(response);
            registerFields.verifyInvalidCpf;
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
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
        });

        when("realizo a requisição de cadastro com o full_name invalido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o full_name invalido", () => {
            registerFields.verifyNotToken(response);
            registerFields.verifyInvalidFullName(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
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
        });

        when("realizo a requisição de cadastro com o email invalido", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro para o email invalido", () => {
            registerFields.verifyNotToken(response);
            registerFields.verifyInvalidEmail(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
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
        });

        when("realizo a requisição de cadastro com senha inválida", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro com senha inválida", () => {
            registerFields.verifyNotToken(response);
            registerFields.verifyInvalidPassword(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
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
        });

        when("realizo a requisição de cadastro com confirmação de senha inválida", async () => {
            response = await utils.registerUser(send);
        });

        then("a responta deve conter um erro com confirmação de senha inválida", () => {
            registerFields.verifyNotToken(response);
            registerFields.verifyInvalidConfirmPassword(response);
        });

        and("o status da resposta deve ser 400", () => {
            registerStatus.checkRegisterFail(response);
        });
    });
});