const successGeneralBalance = 200;

function checkGeneralBalanceSuccess(response) {
    expect(response.status).toBe(successGeneralBalance);
}

module.exports = { 
    checkGeneralBalanceSuccess,
    successGeneralBalance
};