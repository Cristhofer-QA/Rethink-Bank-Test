const generator = require('../../generators/baseGenerator');
module.exports = {
    cpf: generator.generateCpf(false, false, true),
    full_name: generator.generateFullName(),
    email: generator.generateEmail(),
    password: generator.generatePassword(8, true, true, true, true, true)
};