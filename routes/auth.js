const { Router } = require('express');

const router = Router();

router.get('/login', async (req, res) => {
    // рендерим страницу, которая находится views/auth/login
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
    })
});

router.post('/login', async (req, res) => {
    // пакет express-session для работы с сессиями
    // isAuthenticated - наша переменная
    req.session.isAuthenticated = true;
    res.redirect('/')
});

// очищаем сессию и редиректим на главную
router.get('/logout', async (req, res) => {
    // destroy уничтожает все данные сессии и вызывает функцию-коллбек
    req.session.destroy(() => {
        // коллбек нам понадобится чтобы очищать данные из базы данных
        res.redirect('/auth/login#login')
    })
})


module.exports = router;