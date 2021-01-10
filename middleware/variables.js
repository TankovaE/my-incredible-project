module.exports = function(req, res, next) {
    // isAuth - наша переменная
    res.locals.isAuth = req.session.isAuthenticated;

    // next позволяет продолжить выполнение цепочки мидлвеиров
    // если мы его не вызовем, работа приложения остановится на нем
    next();
}