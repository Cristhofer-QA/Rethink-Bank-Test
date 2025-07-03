const { faker } = require('@faker-js/faker');
const featureVar = require('../variables/featuresVariables')
const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z'
];
const specialCharacters = [
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
    '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\',
    ':', ';', '"', "'", '<', '>', ',', '.', '?', '/'
];



// Person
function generateFullName() {
    return faker.person.fullName();
};

function generateFirstName() {
    return faker.person.firstName();
};

function generateLastName() {
    return faker.person.lastName();
};

function generateOneName() {
    const firstName = generateFirstName();
    return firstName.split(" ")[0];
};

function generateName(typeName) {
    switch (typeName) {
        case featureVar.fullNameValid:
            return generateFullName();
        case featureVar.oneName:
            return generateOneName();
        case featureVar.fullNameWithNumber:
            return generateFullName() + generateNumber(0, 9);
        case featureVar.null:
            return null;
    };
};

function generateCpf(typeCpf) {
    withPunctuation = false;
    withLetter = false

    let length = 11;
    let cpf = faker.string.numeric(length);

    switch (typeCpf) {
        case featureVar.cpfMinusDigit:
            length = 6;
            cpf = faker.string.numeric(length);
            break;

        case featureVar.cpfWithPunctuation:
            withPunctuation = true;
            break;

        case featureVar.cpfWithLetter:
            withLetter = true;
            break;

        case featureVar.null:
            return null;

        case featureVar.cpfValid:
        default:
            break;
    };

    if (withPunctuation && length === 11) {
        cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    };

    if (withLetter) {
        const randomLetter = faker.string.alpha(1).toUpperCase();
        cpf = cpf.slice(0, length - 1) + randomLetter;
    };

    return cpf;
};



// Internet
function generateEmail(typeEmail) {
    const email = faker.internet.email().toLowerCase();
    switch (typeEmail) {
        case featureVar.emailValid:
            return email;
        case featureVar.emailInvalid:
            return email.replace('@', '');
        case featureVar.emailWithoutDotCom:
            return email.replace(/\.[a-z]{2,3}$/, '');
        case featureVar.null:
            return null;
    };
};

function returnPasswordConfirm(typePassword, password) {
    const passwordStr = `${password}`;
    switch(typePassword){
        case(featureVar.passwordConfirmDifferent):
            return passwordStr.toUpperCase();
        case(featureVar.passwordConfirmInvalid):
            return generatePassword(featureVar.passwordWithoutNumber)
        case(featureVar.null):
            return null;
    };
}

function generatePassword(typePassword, lengthPassword = 8) {
    let passwordReturn = "";
    let length = lengthPassword
    let useNumber = true;
    let useSpecialChars = true;
    let useCapitalLetter = true;
    let useLowercaseLetter = true;

    switch (typePassword) {
        case featureVar.passwordMinusDigit:
            length = 6;
            break;
        case featureVar.passwordNoCapitalLetter:
            useCapitalLetter = false;
            break;
        case featureVar.passwordNoLowercaseLetter:
            useLowercaseLetter = false;
            break;
        case featureVar.passwordWithoutCharSpecial:
            useSpecialChars = false;
            break;
        case featureVar.passwordWithoutNumber:
            useNumber = false;
            break;
        case featureVar.null:
            return null;
    };

    while (passwordReturn.length < length) {
        if (useLowercaseLetter) {
            passwordReturn = passwordReturn + generateString(1);
        };

        if (useCapitalLetter) {
            passwordReturn = passwordReturn + generateString(1, true);
        };

        if (useNumber) {
            passwordReturn = passwordReturn + generateNumber(0, 9);
        };

        if (useSpecialChars) {
            passwordReturn = passwordReturn + generateSpecialCharacter();

        };
    };
    return passwordReturn.slice(0, length);
};



// Number
function generateNumber(min, max) {
    return faker.number.int({ min: min, max: max });
};



// String
function generateString(length = 10, capitalLetter = false) {
    let stringReturn = "";
    for (let i = 0; i < length; i++) {
        stringReturn = stringReturn + alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    if (capitalLetter) {
        return stringReturn.toUpperCase();
    } else {
        return stringReturn.toLowerCase();
    };
};

function generateAccentedChar() {
    return accentedLetters[Math.floor(Math.random() * accentedLetters.length)];
}

function generateSpecialCharacter() {
    return specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
}

module.exports = {
    generateFullName,
    generateFirstName,
    generateLastName,
    generateOneName,
    generateEmail,
    generatePassword,
    generateCpf,
    generateName,
    returnPasswordConfirm,

    generateNumber,
    generateString,
    generateAccentedChar,
    generateSpecialCharacter
};