const base = require('./baseGenerator');
const featureVar = require('../variables/featuresVariables');

function generateUserValid() {
    const cpf = base.generateCpf(featureVar.cpfValid);
    const fullName = base.generateName(featureVar.fullNameValid);
    const email = base.generateEmail(featureVar.emailValid);
    const password = base.generatePassword(featureVar.emailValid);
    const confirmPassword = password;

    return {
        cpf: cpf,
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    }
}


module.exports = {
    generateUserValid,
};