const generator = require('../../generators/baseGenerator');
module.exports = {
    email: generator.generateEmail(),
    cpf: generator.generateCpf(false, false, true),
    cpfUserAlreadyRegistered: generator.generateCpf(false, false, true),
    fullName: generator.generateFullName(),
    fullNameUserAlreadyRegistered: generator.generateFullName(),
    password: generator.generatePassword(8, true, true, true, true, true),
    passwordUserAlreadyRegistered: generator.generatePassword(8, true, true, true, true, true)
};