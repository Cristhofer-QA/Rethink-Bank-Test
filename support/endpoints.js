module.exports = {
    register: {
        method: 'post',
        path: '/cadastro',
        send: (cpfSend, fullNameSend, emailSend, passwordSend, confirmPasswordSend) => ({
            cpf: cpfSend,
            full_name: fullNameSend,
            email: emailSend,
            password: passwordSend,
            confirmPassword: confirmPasswordSend
        })
    },
    login: {
        method: 'post',
        path: '/login',
        send: (emailSend, passwordSend) => ({
            email: emailSend,
            password: passwordSend
        })
    },
    account: {
        method: 'delete',
        path: '/account',
        send: (passwordSend) => ({
            password: passwordSend
        })
    },
};