const piggyBankExtractSuccess = 200;

function piggyBankExtractSuccessCheck(response) {
    expect(response.status).toBe(piggyBankExtractSuccess);
};

module.exports = {
    piggyBankExtractSuccessCheck,
    piggyBankExtractSuccess

};