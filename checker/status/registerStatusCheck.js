const registerFail = 400;
const registerSuccess = 201;

function checkRegisterSuccess(response) {
    expect(response.status).toBe(registerSuccess);
};

function checkRegisterFail(response) {
    expect(response.status).toBe(registerFail);
};

module.exports = {
    checkRegisterFail,
    checkRegisterSuccess,
};