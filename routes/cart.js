const { Router } = require('express');
// const Cart = require('../models/cart');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

function mapCartItems(cart) {
    return cart.items.map((c) => ({
        ...c.courseId._doc,
        id: c.courseId._id,
        count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

// хотим сделать этот роут доступным толлько для авторизованного пользователя,
// поэтому вторым параметром передаем middleware auth,
// который неавторизованного пользователя редиректит на страницу логина
router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);

    // await Cart.add(course);

    // addToCart - наш пользовательский метод, который мы создали для добавления в корзину
    await req.user.addToCart(course)

    res.redirect('/cart');
})

//обработчик метода get
router.get('/', auth, async (req, res) => {

    // получаем юзера, чтобы достать его корзину, у которой есть список курсов, состоящих из id
    // но нам нужны сами курсы, а не только id,
    // для этого вызываем метод populate, чтобы по связанному courseId получить сами курсы
    const user = await req.user.populate('cart.items.courseId').execPopulate();

    // получаем всю корзину
    // const cart = await Cart.fetch();

    const courses = mapCartItems(user.cart);

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses,
        price: computePrice(courses)
    })
});


router.delete('/remove/:id', auth, async (req, res) => {
    // берем из параметров id и по нему удаляем с помощью метода класса Cart курс
    // const cart = await Cart.remove(req.params.id);

    // c mongodb
    console.log(req.params.id)
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.ites.courseId').execPopulate();

    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: computePrice(courses),
    }
    
    // отвечаем клиенту, что все ок и отдаем обновленную корзину
    res.status(200).json(cart);
})

module.exports = router;