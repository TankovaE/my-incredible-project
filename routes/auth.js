const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const regEmail = require('../emails/registration');
// встроенная библиотека node js
const crypto = require('crypto');
const resetEmail = require('../emails/reset');
const { validationResult } = require('express-validator/check');
const { registerValidators } =  require('../utils/validators');

//создаем транспортер для отправки писем
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

const router = Router();

router.get('/login', async (req, res) => {
    // рендерим страницу, которая находится views/auth/login
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
        // передаем на клиент ощибку, которую отправляет запрос /register вместе с редиректом в случаем ошибки
        // flas хранит все данные в сессии, со временем они удалятся
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError'),
        
    })
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            // сравниваем введенный пароль с зашиырованным с помощью библиотеки bcrypt
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                // если пароль верный
                const user = candidate;
                // session берется из пакета для работы с сессиями express-session 
                // isAuthenticated - наша переменная
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    // делаем редирект только если авторизация прошла ок
                    res.redirect('/')
                })
            } else  {
                req.flash('loginError', 'Wrong password')
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User is not exist')
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

// очищаем сессию и редиректим на главную
router.get('/logout', async (req, res) => {
    // destroy уничтожает все данные сессии и вызывает функцию-коллбек
    req.session.destroy(() => {
        // коллбек нам понадобится чтобы очищать данные из базы данных
        res.redirect('/auth/login#login')
    })
});

// вторым и далее аргументом может быть любое кол-во мидвеиров, последний мидлвеир - обработчик
// registerValidators - мидлвеир-валидатор из библиотеки express-validator
router.post('/register', registerValidators, async (req, res) => {
    try {
        // берем из формы данные, которые ввел пользователь при регистрации
        const { email, name, password, confirm } = req.body;

        // проверяем, есть ли ошибка от валидатора
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            // 422 - ошибка валидации
            return res.status(422).redirect('/auth/login#register');
        }

        // ищем в базе юзера с такие емейлом
        const candidate = await User.findOne({ email });

        if (candidate) {
            // метод из библиотеки flash, который позволяет с помощью сессии делать транспортировку определенныx ошибок между запросами
            req.flash('registerError', 'User with this email is exist')
            res.redirect('/auth/login#register');
        } else {
            // hash - асинхронный метод, который возвращает промис
            // он помогает нам зашифровать пароль
            // так password : "$2a$10$iR0mSyxUSMw85Cb7XBNOj.aOTSvQGa8VSc.zioHcAolz7aWBd7X5m" он будет выглядеть в базе в зашифрованном виде
            const hashPassword = await bcrypt.hash(password, 10)
            // добавляем нового юзера только если email не занят
            const user = new User({
                email, name, password: hashPassword, cart: { items: [] }
            });
            await user.save();
            // отправляем пользователю письмо с информацией о регистрауии
            // будет отправляться в фоновом режиме, после редиректа, чтобы пользователь не ждал
            await transporter.sendMail(regEmail(email));
            res.redirect('/auth/login#login');
        }

    } catch (e) {
        console.log(e);
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "Forget password?",
        error: req.flash('error')
    })
});

router.post('/reset', (req, res) => {
    try {
        // в чем заключается идея восстановления пароля: мы будем генерировать рендомный ключ,
        // который запишем пользователю в базу данных, после этого мы отправим письмо этому пользователю,
        // содержащее данный ключ, человек пройдет по ссылке, которая будет содержать данный ключ,
        // если он совпадает с ключом, который записан у него в базе данных и у него не истечет время жизни
        // данного токена, то тогда мы дадим ему возможность изменить пароль

        // crypto.randomBytes позволяет нам сгенерировать токен
        // randomBytes принимает количество символов и коллбек
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/auth/reset');
            }

            // создаем токен и ищем в базе юзера по email
            const token = buffer.toString('hex');
            const candidate = await User.findOne({email: req.body.email});

            // если юзер найден, прописываем ему токен и время жизни в базу
            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                // сохраняем в базу
                await candidate.save();
                // отправляем email с токеном
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'This email is not exist');
                res.redirect('/auth/reset');
            }
        })

    } catch (e) {
        console.log(e)
    }
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne( {
            resetToken: req.params.token,
            // $gt позволяет сравнить дату (grater) https://docs.mongodb.com/manual/reference/operator/query/gt/
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: "Set password",
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            })
        }
    } catch (e) {
        console.log(e)
    }
});

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne( {
            _id: req.body.userId,
            resetToken: req.body.token,
            // $gt позволяет сравнить дату (grater) https://docs.mongodb.com/manual/reference/operator/query/gt/
            // т. е. больше чем Date.now()
            resetTokenExp: { $gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else{
            req.flash('loginError', 'Token expired ')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})


module.exports = router;