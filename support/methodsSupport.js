async function confirmEmail(token) {
    const res = await utils.confirmEmail(token);

    if (res.status !== 200) {
        throw new Error('Email não foi validado, cenário ignorado');
    };
};

async function registerUser() {
    const userData = userGenerator.generateUserValid();
    let userCreated = true;
    let confirmToken;

    const sent = userGenerator.generateUserData(
        userData.name,
        userData.email,
        userData.password,
        userData.confirmPassword
    );
    try {
        const res = await utils.registerUser(sent);
        confirmToken = res.body.confirmToken;
    } catch {
        userCreated = false;
    };
    return { userCreated, confirmToken, userData };
};

async function loginUser(email, password) {
    const res = await utils.loginUser(email, password);
    if (res.status !== 200) {
        throw new Error('Usuário não foi logado, cenário ignorado');
    };
    return res.body;
};





function verifyUserCreated(userCreated) {
    if (!userCreated) {
        throw new Error('Usuário não foi criado, cenário ignorado');
    };
};











module.exports = {
    confirmEmail,
    verifyUserCreated,
    registerUser,
    loginUser,
};