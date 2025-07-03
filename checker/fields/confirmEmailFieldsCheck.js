const confirmEmailSuccessMessage = 'E-mail confirmado com sucesso.';
const confirmTokenExpiredMessage = 'Token inválido ou expirado.';


function verifyConfirmEmailSuccess(response) {
    expect(response.text).toBe(confirmEmailSuccessMessage);
};

function verifyConfirmTokenInvalid(response) {
    expect(response.text).toBe(confirmTokenExpiredMessage);
};


module.exports = {
    verifyConfirmEmailSuccess,
    verifyConfirmTokenInvalid,
};