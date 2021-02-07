const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const regEmail = require('../emails/registration')

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

router.post('/register', async (req, res) => {
    try {
        // берем из формы данные, которые ввел пользователь при регистрации
        const { email, name, password, repeat } = req.body;
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


module.exports = router;