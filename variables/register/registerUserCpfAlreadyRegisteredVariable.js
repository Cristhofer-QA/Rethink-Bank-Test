const generator = require('../../generators/baseGenerator');
module.exports = {
    cpf: generator.generateCpf(false, false, true),
    fullName: generator.generateFullName(),
    fullNameUserAlreadyRegistered: generator.generateFullName(),
    email: generator.generateEmail(),
    emailUserAlreadyRegistered: generator.generateEmail(),
    password: generator.generatePassword(8, true, true, true, true, true),
    passwordUserAlreadyRegistered: generator.generatePassword(8, true, true, true, true, true)
};