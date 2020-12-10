const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

// с помощью router можно описывать конкретные роуты
// здесь первый параметр "/", так как мы указали префикс в файле index.js для каждого роута
// app.use('/courses', coursesRoutes)
router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Courses', 
        isCourses: true,
        courses,
    });
});


// обрабатываем новый get запрос, так как мы получаем новую страницу
// передаем адрес, который мы хотим обработать, "/", не забываем что у нас есть префикс в виде '/courses'
// динамичный параметр передаем после двоеточия
router.get('/:id', async (req, res) => {
    // берем из параметров url id, и по нему из базы с помощью метода getById достаем курс с этим id
    const course = await Course.getById(req.params.id);

    // рендерим страницу course
    res.render('course', {
        // у страницы курса свой layout
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    });
})

module.exports = router;