const { Router } = require('express');

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

module.exports = router;