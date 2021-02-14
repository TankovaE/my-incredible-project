const keys = require('../keys');

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Welcome to Incredible courses! Confirm Your Email',
        html: `
            <h1>You're on your way!</h1>
            <h2>Let's confirm your email address!</h2>
            <p>Your email is ${email}</p>
            <p>By clicking on the following link, you are confirming your email address.</p>
            <a href="/">Confirm</a>
            <hr />
            <a href="${keys.BASE_URL}">Incredible courses</a>
            <a href="unsubscribe">Unsubscribe</a>
        `,
    }
}