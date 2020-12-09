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

module.exports = router;