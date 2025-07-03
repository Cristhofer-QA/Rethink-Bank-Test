const pointSendedSuccess = 'Pontos enviados com sucesso.';
const insufficientBalance = 'Saldo insuficiente';
const userDestinationNotFound = 'Usuário destino não encontrado';

function sendPointsSuccess(response) {
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(pointSendedSuccess);
};

function verifyInsufficientBalance(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(insufficientBalance);
};

function verifyUserDestinationNotFound(response) {
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(userDestinationNotFound);
};

module.exports = {
    sendPointsSuccess,
    verifyInsufficientBalance,
    verifyUserDestinationNotFound,
};