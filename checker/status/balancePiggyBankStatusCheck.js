const balancePiggyBankSuccess = 200;

function balancePiggyBankSuccessCheck(response) {
    expect(response.status).toBe(balancePiggyBankSuccess);
};

module.exports = {
    balancePiggyBankSuccessCheck,
};