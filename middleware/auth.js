module.exports = function(req, res, next) {
    // если юзер не авторизован и пытается попасть на защищенные страницы, то отправляем его на страницу login
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }

    next();
}