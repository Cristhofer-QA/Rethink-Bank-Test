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
    confirm_email: {
        method: 'get',
        path: '/confirm-email'
    },
    general_balance: {
        method: 'get',
        path: '/points/saldo'
    },
    send_point: {
        method: 'post',
        path: '/points/send',
        send: (cpfRecipient, amountSend) => ({
            recipientCpf: cpfRecipient,
            amount: amountSend
        })
    },
    extract_point: {
        method: 'get',
        path: '/points/extrato'
    },
    send_points_piggy_bank: {
        method: 'post',
        path: '/caixinha/deposit',
        send: (amountSend) => ({
            amount: amountSend
        })
    },
    points_piggy_bank_extract: {
        method: 'get',
        path: '/caixinha/extrato'
    },
    withdraw_points_piggy_bank: {
        method: 'post',
        path: '/caixinha/withdraw',
        send: (amountSend) => ({
            amount: amountSend
        })
    }
};