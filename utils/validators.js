const { body } = require('express-validator/check');
const User = require('../models/user');

// body проверфет body запроса, есть и другие валидаторы

exports.registerValidators = [
    body('email').isEmail().withMessage('Enter correct email').custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject('User with this email is exist')
            }
        } catch (e) {
            console.log(e);
        }
    }),
    // isAlphanumeric проверет, чтобы пароль состоял из цифр или букв и был латинский
    body('password', 'Minimum password length 6 characters').isLength({ min: 3, max: 56 }).isAlphanumeric(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password mismatch');
        }

        return true;
    }),
    body('name').isLength({ min: 3 }).withMessage('Minimum password length 3 characters')

]