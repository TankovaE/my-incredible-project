const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    // тип формата id, с которым работает mongoose
                    type: Schema.Types.ObjectId,
                    // ссылка на другую сущность (Course) из базы
                    // имя соответствует имени, которое мы экспортировали в модели курсов
                    ref: "Course",
                    required: true,
                }
            }
        ]
    }
});

// определяем свой метод, который вынесет логику в объект пользователя
// не используем здесь стрелочную функцию, так как у нее нет this
userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items]; // updated items
    const idx = items.findIndex(c => {
        // toString нужен так как тип у id объект ObjectId
        return c.courseId.toString() === course._id.toString();
    });

    // проверяем, есть ли в корзине такой курс, чтобы понять, нужно его добавить или увеличить count
    if (idx >= 0) {
        items[idx].count += 1;
    } else {
        items.push({
            courseId: course._id,
            count: 1,
        })
    };

    this.cart = { items };
    return this.save();

}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => c.courseId.toString() === id.toString());

    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString());

    } else {
        items[idx].count--
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = model('User', userSchema)