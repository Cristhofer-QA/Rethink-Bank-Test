function verifyValuesPoints(response, normalBalance, piggyBankBalance) {
    expect(response.body).toHaveProperty('normal_balance');
    expect(response.body).toHaveProperty('piggy_bank_balance');
    expect(response.body.normal_balance).toBe(normalBalance);
    expect(response.body.piggy_bank_balance).toBe(piggyBankBalance);
}

module.exports = { verifyValuesPoints };