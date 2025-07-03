const unauthorizedMessage = 'Não autorizado';
const accountSuccessMessage = 'Conta marcada como deletada.';
const invalidPasswordMessage = 'Senha inválida';


function verifyErrorAccount(body, message) {
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(message);
};

function verifyInvalidPasswordMessage(response) {
    verifyErrorAccount(response.body, invalidPasswordMessage);
}

function verifyUnauthorizedMessage(response) {
    verifyErrorAccount(response.body, unauthorizedMessage);
};

function verifyAccountSuccessMessage(response) {
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(accountSuccessMessage);
};


module.exports = {
    verifyUnauthorizedMessage,
    verifyAccountSuccessMessage,
    verifyInvalidPasswordMessage,
};