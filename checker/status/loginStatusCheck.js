const loginSuccess = 200;
const emailNotConfirmed = 403;
const credentialsInvalid = 400;

function loginSuccessStatusCheck(response) {
    expect(response.status).toBe(loginSuccess);
};

function loginCredentialsInvalid(response) {
    expect(response.status).toBe(credentialsInvalid);
};

function loginEmailNotConfirmed(response) {
    expect(response.status).toBe(emailNotConfirmed);
};

module.exports = {
    loginSuccess,
    loginEmailNotConfirmed,
    loginCredentialsInvalid,
    loginSuccessStatusCheck,
};