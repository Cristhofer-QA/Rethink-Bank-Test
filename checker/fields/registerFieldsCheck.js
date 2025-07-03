const successRegistrationMessage = 'Cadastro realizado com sucesso.';
const cpfInvalidMessage = 'CPF inválido';
const emailInvalidMessage = 'Email inválido';
const passwordInvalidMessage = 'Senha fraca';
const fullNameInvalidMessage = 'Nome completo obrigatório';
const cpfAlreadyRegisteredMessage = 'duplicate key value violates unique constraint \"users_cpf_key\"';
const passwordConfirmInvalidMessage = 'Senhas não conferem';
const emailAlreadyRegisteredMessage = 'duplicate key value violates unique constraint \"users_email_key\"';

function checkRegisterSuccess(response) {
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('confirmToken');
    expect(response.body.message).toBe(successRegistrationMessage);
    expect(response.body.confirmToken).not.toBeNull();
    expect(response.body.confirmToken).toBeDefined();
};

function cpfAlreadyRegisteredCheck(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(cpfAlreadyRegisteredMessage);
};

function emailAlreadyRegisteredCheck(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(emailAlreadyRegisteredMessage);
};

function verifyInvalidCpf(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(cpfInvalidMessage);
};

function verifyInvalidFullName(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(fullNameInvalidMessage);
};

function verifyInvalidEmail(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(emailInvalidMessage);
};

function verifyInvalidPassword(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(passwordInvalidMessage);
};

function verifyInvalidConfirmPassword(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(passwordConfirmInvalidMessage);
};

function verifyNotToken(response) {
    expect(response.body).not.toHaveProperty('confirmToken');
};

module.exports = {
    verifyNotToken,
    verifyInvalidCpf,
    verifyInvalidEmail,
    checkRegisterSuccess,
    verifyInvalidPassword,
    verifyInvalidFullName,
    cpfAlreadyRegisteredCheck,
    emailAlreadyRegisteredCheck,
    verifyInvalidConfirmPassword
};