const registerSuccess = 201;
const registerFail = 400;

function checkRegisterSuccess(response) {
    expect(response.status).toBe(registerSuccess);
}

function checkRegisterFail(response) {
    expect(response.status).toBe(registerFail);
}

module.exports = {
    checkRegisterFail,
    checkRegisterSuccess,
}