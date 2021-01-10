const { Router } = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');


// с помощью router можно описывать конкретные роуты
// здесь первый параметр "/", так как мы указали префикс в файле index.js для каждого роута
// app.use('/courses', coursesRoutes)
router.get('/', async (req, res) => {
    // без mongodb
    // const courses = await Course.getAll();

    // с mongodb
    // find отдает все данные если ему не передавать параметры
    // populate позволяет получить не просто userId, который есть у каждого курса в mongodb
    // а целиком объект юзера, благодаря связке ref в моделях
    // select позволяет достать только определенные поля, а не все
    const courses = await Course.find({})
        .populate('userId')
        // .select('price image name');

    console.log(courses);

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
    // без mongodb
    // const course = await Course.getById(req.params.id);

    // c mongodb
    const course = await Course.findById(req.params.id);

    // рендерим страницу course
    res.render('course', {
        // у страницы курса свой layout
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    });
});

// хотим сделать этот роут доступным толлько для авторизованного пользователя,
// поэтому вторым параметром передаем middleware auth,
// который неавторизованного пользователя редиректит на страницу логина
router.get('/:id/edit', auth, async (req, res) => {
    // смотрим в query.allow, чтобы выяснить доступно ли редактирование для данного курса
    // если query.allow=false, редиректим на главную
    if (!req.query.allow) {
        //делаем возврат чтобы функция не продолжала выполнение
        return res.redirect('/')
    }

    // без mongodb
    // const course = await Course.getById(req.params.id);

    // с mongodb
    const course = await Course.findById(req.params.id)

    //имя страницы (view)
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
});


// <form action="/courses/edit" method="POST"></form>
router.post('/edit', auth, async (req, res) => {
    // с mongodb
    const { id } = req.body;
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses');
})


router.post('/remove', auth, async (req, res) => {
    try {
        // позволяет удалить объект, при условии совпадения id, условие мы передаем в пропсах: _id: req.body.id
        // означает оно, что id из формы из body совпадает с id в mongodb
        await Course.deleteOne({_id: req.body.id});   
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }

})

module.exports = router;