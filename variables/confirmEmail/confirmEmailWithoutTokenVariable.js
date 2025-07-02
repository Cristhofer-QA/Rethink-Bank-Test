const generator = require('../../generators/baseGenerator');
const featureVar = require('../variables/featuresVariables')

module.exports = {
    cpf: generator.generateCpf(featureVar.cpfValid),
    fullName: generator.generateFullName(featureVar.fullNameValid),
    email: generator.generateEmail(featureVar.emailValid),
    password: generator.generatePassword(featureVar.passwordValid),
};