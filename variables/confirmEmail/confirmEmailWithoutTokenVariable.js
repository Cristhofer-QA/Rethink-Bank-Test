const generator = require('../../generators/baseGenerator');
module.exports = {
    cpf: generator.generateCpf(false, false, true),
    fullName: generator.generateFullName(),
    email: generator.generateEmail(),
    password: generator.generatePassword(15, true, true, true, false, true),
};