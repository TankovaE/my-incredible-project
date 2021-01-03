// C MONGODB

// мы создаем определенную модель, которую регистрируем в mongoose
// для модели нужна схема, которая будет описывать, какие поля есть в моделели, что они значат,
// какие есть дефолтные значения, валидаторы, связи - все свойства данной модели в схеме

const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
    // поле id mongoose будет автоматически создавать при создании новой модели
});

// трансформируем данные для клиента
courseSchema.method('toClient', function() {
    const course = this.toObject();

    course.id = course._id;
    delete course._id;

    return course;
})

// model позволяет регистрировать и создавать новые модели на основе схемы
module.exports = model('Course', courseSchema)

// БЕЗ MONGODB

// const { v4: uuidV4 } = require('uuid');
// const fs = require('fs');
// const path = require('path')

// //модель будет работать с данными, получать, обрабатыать и записывать в базу данных

// class Course {
//     constructor(title, price, image){
//         this.title = title;
//         this.price = price;
//         this.image = image;
//         this.id = uuidV4();
//     }
    
//     //хелпер, который будет возвращать результат работы глобального объекта JSON.strgingify()
//     toJSON() {
//         return ({
//             title: this.title,
//             price: this.price,
//             image: this.image,
//             id: this.id
//         })
//     }

//     async save() {
//         //обрабатываем промис, который читает нашу базу данных и возвращает данные
//         //сюда мы будем записывать новые данные
//         const courses = await Course.getAll();
//         courses.push(this.toJSON());

//         return new Promise ((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve()
//                     }
//                 }
        
//             )
//         });
//     }

//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         //получает данные в виде строки, ее нужно распарсить с помощью JSON.parse
//                         resolve(JSON.parse(content))
//                     };
    
//                 }
//             )
//         });
//     }

//     static async getById(id) {
//        const courses = await Course.getAll();

//        return courses.find(c => c.id === id);
//     }

//     static async update(course) {
//         const courses = await Course.getAll();

//         //ищем index редактируемого курса по id
//         const idx = courses.findIndex(c => c.id === course.id);

//         //обновляем его данные
//         courses[idx] = course;

//         // записываем в базу
//         return new Promise ((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve()
//                     }
//                 }
        
//             )
//         });
//     }
// }

// module.exports = Course;

