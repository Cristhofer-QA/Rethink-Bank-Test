const userNotFound = 404;
const sendPointsFail = 400;
const sendPointsSuccess = 200;

function sendPointsStatusCheck(response) {
    expect(response.status).toBe(sendPointsSuccess);
};

function sendPointsFailCheck(response) {
    expect(response.status).toBe(sendPointsFail);
};

function userDestinationNotFoundCheck(response) {
    expect(response.status).toBe(userNotFound);
};

module.exports = {
    sendPointsFailCheck,
    sendPointsStatusCheck,
    userDestinationNotFoundCheck
};