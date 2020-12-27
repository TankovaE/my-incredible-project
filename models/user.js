const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
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

module.exports = model('User', userSchema)