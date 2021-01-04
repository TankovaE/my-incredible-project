const { Router } = require('express');
const Order = require('../models/order');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId');

        console.log('ORDERS', orders)
        res.render('orders', {
            isOrders: true,
            title: 'Orders',
            orders: orders.map(order => {
                return {
                    ...order._doc,
                    price: order.courses.reduce((total, { count, course }) => (total + count * course.price), 0)}
            })
        })
    } catch (e) {
        console.log(e);
    }

});

router.post('/', async(req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate();

        const courses = user.cart.items.map(i => ({count: i.count, course: {...i.courseId._doc}}))
    
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses,
        });
    
        await order.save();
        await req.user.clearCart();
    
        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;