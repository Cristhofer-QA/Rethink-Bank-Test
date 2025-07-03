const passwordInvalid = 400;
const unauthorized = 401;
const success = 200;

function verifyStatusPasswordInvalid(status) {
    expect(status).toBe(passwordInvalid);
};

function verifyStatusUnauthorized(status) {
    expect(status).toBe(unauthorized);
};

function verifyStatusSuccess(status) {
    expect(status).toBe(success);
};


module.exports = {
    verifyStatusSuccess,
    verifyStatusUnauthorized,
    verifyStatusPasswordInvalid,
};