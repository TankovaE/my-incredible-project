const keys = require('../keys');

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password recovery',
        html: `
            <h1>You have requested password recovery</h1>
            <a href="${keys.BASE_URL}/auth/password/${token}">Reset</a>
            <hr />
            <a href="${keys.BASE_URL}">Incredible courses</a>
            <a href="unsubscribe">Unsubscribe</a>
        `,
    }
}