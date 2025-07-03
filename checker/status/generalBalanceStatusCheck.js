const successGeneralBalance = 200;

function checkGeneralBalanceSuccess(response) {
    expect(response.status).toBe(successGeneralBalance);
};s

module.exports = { 
    checkGeneralBalanceSuccess,
    successGeneralBalance
};