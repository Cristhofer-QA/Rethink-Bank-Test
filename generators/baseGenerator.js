const { faker } = require('@faker-js/faker');

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

const accentedLetters = [
    'á', 'à', 'â', 'ã', 'ä', 'å',
    'é', 'è', 'ê', 'ë',
    'í', 'ì', 'î', 'ï',
    'ó', 'ò', 'ô', 'õ', 'ö',
    'ú', 'ù', 'û', 'ü',
    'ç'
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

function generateCpf(withPunctuation, withLetter, validLength) {
    let cpf = "";
    const length = validLength ? 10 : 6;
    while (cpf.length < length) {
        cpf = cpf + generateNumber(0, 9);
    };

    if (withLetter) {
        cpf = cpf + generateString(1);
    } else {
        cpf = cpf + generateNumber(0, 9);
    };

    if (validLength) {
        if (withPunctuation) {
            return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9);
        }
    };

    return cpf;
};



// Internet
function generateEmail() {
    return faker.internet.email().toLowerCase();
};

function generatePassword(lengthPassword = 8, useLowercaseLetter, useCapitalLetter, useNumber, useAccentuation, useSpecialChars) {
    let passwordReturn = "";
    while (passwordReturn.length < lengthPassword) {
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

        if (useAccentuation) {
            passwordReturn = passwordReturn + generateAccentedChar();

        };
    };

    return passwordReturn.slice(0, lengthPassword);

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
        return stringReturn.toLocaleLowerCase();
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

    generateNumber,
    generateString,
    generateAccentedChar,
    generateSpecialCharacter
};