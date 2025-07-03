const emailNotConfirmed = 'E-mail não confirmado';
const credentialsInvalidMessage = 'Credenciais inválidas';

function fieldsLoginSuccessCheck(response) {
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toBeNull();
    expect(response.body.token).toBeDefined();
};

function fieldsLoginErrorCheck(response) {
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBeDefined();
};

function verifyLoginSuccess(response) {
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toBeNull();
    expect(response.body.token).toBeDefined();
};

function verifyLoginEmailNotConfirmed(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(emailNotConfirmed);
};

function verifyLoginCredentialsInvalid(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(credentialsInvalidMessage);
};

function verifyNotToken(response) {
    expect(response.body).not.toHaveProperty('token');
};


module.exports = {
    verifyNotToken,
    verifyLoginSuccess,
    fieldsLoginErrorCheck,
    fieldsLoginSuccessCheck,
    verifyLoginEmailNotConfirmed,
    verifyLoginCredentialsInvalid,
};