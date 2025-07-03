const invalidPasswordMessage = 'Senha inválida';
const unauthorizedMessage = 'Não autorizado';
const accountSuccessMessage = 'Conta marcada como deletada.';


function verifyErrorAccount(body, message) {
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(message);
};

function verifyInvalidPasswordMessage(body) {
    verifyErrorAccount(body, invalidPasswordMessage);
}

function verifyUnauthorizedMessage(body) {
    verifyErrorAccount(body, unauthorizedMessage);
};

function verifyAccountSuccessMessage(body) {
    expect(body).toHaveProperty("message");
    expect(body.message).toBe(accountSuccessMessage);
};




module.exports = {
    verifyUnauthorizedMessage,
    verifyAccountSuccessMessage,
    verifyInvalidPasswordMessage,
};