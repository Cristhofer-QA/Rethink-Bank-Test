const accessDeniedStatus = 401;
const withdrawSuccessStatus = 200;
const invalidWithdrawPiggyPiggyBankStatus = 400;

function withdrawPiggyPiggyBankFailCheck(response) {
    expect(response.status).toBe(invalidWithdrawPiggyPiggyBankStatus);
};

function withdrawPiggyBankAccessDenied(response) {
    expect(response.status).toBe(accessDeniedStatus);
};

function withdrawPiggyBankSuccessCheck(response) {
    expect(response.status).toBe(withdrawSuccessStatus);
};

module.exports = {
    withdrawPiggyBankSuccessCheck,
    withdrawPiggyBankAccessDenied,
    withdrawPiggyPiggyBankFailCheck,
};
