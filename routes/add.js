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

router.post('/', async (req, res)=>{
    const course = new Course(req.body.title, req.body.price, req.body.image);

    await course.save();

    res.redirect('/courses')
})

module.exports = router;