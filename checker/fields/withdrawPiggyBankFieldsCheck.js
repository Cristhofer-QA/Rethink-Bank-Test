const accessDeniedMessage = 'Não autorizado';
const invalidTokenMessage = 'Token inválido ou expirado';
const successWithdrawMessage = 'Resgate da caixinha realizado.';
const insufficientPointsPiggyBankMessage = 'Saldo na caixinha insuficiente';


function verifyAccessDenied(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(accessDeniedMessage);
};

function verifyInsufficientPointsPiggyBank(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(insufficientPointsPiggyBankMessage);
};

function verifyInvalidToken(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(invalidTokenMessage);
};

function verifyWithdrawSuccess(response) {
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(successWithdrawMessage);
};

module.exports = { 
    verifyInvalidToken,
    verifyAccessDenied,
    verifyWithdrawSuccess,
    verifyInsufficientPointsPiggyBank, 
};