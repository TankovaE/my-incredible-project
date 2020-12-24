const { Router } = require('express');

const router = Router();

//с помощью router можно описывать конкретные роуты
router.get('/', (req, res) => {
        res.render('index', {
        //имя можно выбрать любое
        title: 'Main page',
        isHome: true,
    });

})


module.exports = router;