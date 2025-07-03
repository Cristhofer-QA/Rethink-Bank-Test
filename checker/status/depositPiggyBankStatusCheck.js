const depositFail = 400;
const invalidToken = 401;
const depositSuccess = 200;

function depositPiggyBankFailCheck(response) {
    expect(response.status).toBe(depositFail);
};

function depositPiggyBankInvalidTokenCheck(response) {
    expect(response.status).toBe(invalidToken);
};

function depositPiggyBankSuccessCheck(response) {
    expect(response.status).toBe(depositSuccess);
};

module.exports = {
    depositPiggyBankFailCheck,
    depositPiggyBankInvalidTokenCheck,
    depositPiggyBankSuccessCheck
};