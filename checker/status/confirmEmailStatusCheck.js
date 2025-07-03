const confirmEmailSuccess = 200;
const tokenIncorrect = 400;

function verifyConfirmEmailSuccess(response) {
    expect(response.status).toBe(confirmEmailSuccess);
}

function verifyIncorrectToken(response) {
    expect(response.status).toBe(tokenIncorrect);
}

module.exports = {
    confirmEmailSuccess,
    verifyIncorrectToken,
    verifyConfirmEmailSuccess,
};