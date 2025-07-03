const accessDeniedMessage = 'Não autorizado';
const invalidTokenMessage = 'Token inválido ou expirado';
const depositedSuccessMessage = 'Depósito na caixinha realizado.';
const insufficientPointsMessage = 'Saldo insuficiente';

function accessDeniedMessageCheck(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(accessDeniedMessage);
};

function invalidTokenMessageCheck(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(invalidTokenMessage);
};

function depositedSuccessMessageCheck(response) {
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(depositedSuccessMessage);
};

function insufficientPointsMessageCheck(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(insufficientPointsMessage);
};

module.exports = { 
    accessDeniedMessageCheck, 
    invalidTokenMessageCheck, 
    depositedSuccessMessageCheck, 
    insufficientPointsMessageCheck 
};
