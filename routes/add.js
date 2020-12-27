const { Router } = require('express');
const Course = require('../models/course')

const router = Router();

// с помощью router можно описывать конкретные роуты
// здесь первый параметр "/", так как мы указали префикс в файле index.js для каждого роута
// app.use('/add', addRoutes)
router.get('/', (req, res) => {
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
router.post('/', async (req, res) => {
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