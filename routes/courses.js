const { Router } = require('express');

const router = Router();

// с помощью router можно описывать конкретные роуты
// здесь первый параметр "/", так как мы указали префикс в файле index.js для каждого роута
// app.use('/courses', coursesRoutes)
router.get('/', (req, res) => {
    res.render('courses', {
        title: 'Courses', 
        isCourses: true,
    });
});

module.exports = router;