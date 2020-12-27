const { Router } = require('express');
// const Cart = require('../models/cart');
const Course = require('../models/course');


const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);

    // await Cart.add(course);

    // addToCart - наш пользовательский метод, который мы создали для добавления в корзину
    await req.user.addToCart(course)

    res.redirect('/cart');
})

//обработчик метода get
router.get('/', async (req, res) => {
    // получаем всю корзину
    // const cart = await Cart.fetch();
    // res.render('cart', {
    //     title: 'Cart',
    //     isCart: true,
    //     courses: cart.courses,
    //     price: cart.price
    // })
})

router.delete('/remove/:id', async (req, res) => {
    // берем из параметров id и по нему удаляем с помощью метода класса Cart курс
    const cart = await Cart.remove(req.params.id);
    
    // отвечаем клиенту, что все ок и отдаем обновленную корзину
    res.status(200).json(cart);
})

module.exports = router;