const sendPointsSuccess = 200;
const sendPointsFail = 400;
const userNotFound = 404;

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