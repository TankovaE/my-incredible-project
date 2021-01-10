module.exports = function(req, res, next) {
    // isAuth - наша переменная
    res.locals.isAuth = req.session.isAuthenticated;

    next();
}