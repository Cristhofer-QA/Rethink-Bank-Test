const invalidPasswordMessage = 'Senha inválida';

function verifyErrorAccount(body, message) {
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(message);
};

function verifyInvalidPasswordMessage(body) {
    verifyErrorAccount(body, invalidPasswordMessage);
}





module.exports = {
    verifyInvalidPasswordMessage,
};