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

router.get('/:id/edit', async (req, res) => {
    // смотрим в query.allow, чтобы выяснить доступно ли редактирование для данного курса
    // если query.allow=false, редиректим на главную
    if (!req.query.allow) {
        //делаем возврат чтобы функция не продолжала выполнение
        return res.redirect('/')
    }

    const course = await Course.getById(req.params.id);

    //имя страницы (view)
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
});


// <form action="/courses/edit" method="POST"></form>
router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/courses');
})


module.exports = router;