const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
    // рендерим страницу, которая находится views/auth/login
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
    })
});

router.post('/login', async (req, res) => {
    const user = await User.findById('5fe8cb422cce6422f4b59419');
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
        //берез из формы данные, которые ввел пользователь при регистрации
        const { email, name, password, repeat } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const user = new User({
                email, name, password, cart: { items: [] }
            });
            await user.save();
            res.redirect('/auth/login#login');
        }

    } catch (e) {
        console.log(e);
    }
})


module.exports = router;