const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator/check');
 
const router = Router();

// с помощью router можно описывать конкретные роуты
// здесь первый параметр "/", так как мы указали префикс в файле index.js для каждого роута
// app.use('/add', addRoutes)
// хотим сделать этот роут доступным толлько для авторизованного пользователя,
// поэтому вторым параметром передаем middleware auth,
// который неавторизованного пользователя редиректит на страницу логина
router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });

})

// без mongodb
// router.post('/', async (req, res)=>{
//     const course = new Course(req.body.title, req.body.price, req.body.image);

//     await course.save();

//     res.redirect('/courses')
// })

//c mongodb
router.post('/', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            error: errors.array()[0].msg,
            // передаем полученный данные вместе с ответом, чтобы форма не стиралась после запроса с ошибкой
            data: {
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user._id
    })

    // save идет в реальную базу данных и сохраняет данную модель в определенной коллекции
    try {
        await course.save();
    } catch (e) {
        console.log(e);
    } finally {
        res.redirect('/courses')
    }
    
})

module.exports = router;