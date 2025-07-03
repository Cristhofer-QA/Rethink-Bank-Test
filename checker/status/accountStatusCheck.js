const passwordInvalid = 400;
const unauthorized = 401;
const accountSuccess = 200;

function verifyStatusPasswordInvalid(response) {
    expect(response.status).toBe(passwordInvalid);
};

function verifyStatusUnauthorized(response) {
    expect(response.status).toBe(unauthorized);
};

function verifyStatusSuccess(response) {
    expect(response.status).toBe(accountSuccess);
};


module.exports = {
    accountSuccess,
    verifyStatusSuccess,
    verifyStatusUnauthorized,
    verifyStatusPasswordInvalid,
};