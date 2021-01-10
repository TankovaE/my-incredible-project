const User = require('../models/user');

module.exports = async function(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    
    // нужно чтобы преобразовать простые данны юзера (из базы из collection: sessions), которые создал пакет connect-mongodb-sessio в базе
    // в данные юзера которые хранятся в коллекции users и записать их в req.user
    req.user = await User.findById(req.session.user._id);
    next();
}