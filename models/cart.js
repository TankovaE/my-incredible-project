// const fs = require('fs');
// const path = require('path');

// // геренерируем путь к файлу с данными заранее
// const p = path.join(
//     path.dirname(process.mainModule.filename), 'data', 'cart.json'
// )

// class Cart {

//     static async add (course) {
//         const cart = await Cart.fetch();

//         const idx = cart.courses.findIndex(c => c.id === course.id);
//         const candidate = cart.courses[idx];

//         if (candidate) {
//             // курс уже есть, нужно добавить кол-во

//             // добавляем количество
//             candidate.count++
//             // перезаписываем курс с обновленным количеством
//             cart.courses[idx] = candidate
//         } else {
//             // курса нет, нужно добавить курс

//             // добавляем к курсу свойство с количеством
//             course.count = 1
//             cart.courses.push(course)
//         }

//         cart.price += Number(course.price);

//         // записываем обновленную корзину в базу
//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve()
//                 }
//             })
//         })
//     }

//     static async fetch () {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 // путь к файлу (который мы сгенерировали в начале файла)
//                 p,
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
//         })
//     }

//     static async remove(id) {
//         const cart = await Cart.fetch();

//         const idx = cart.courses.findIndex(c => c.id === id);
//         const course = cart.courses[idx];

//         if (course.count === 1) {
//             // удаляем
//             cart.courses = cart.courses.filter(c => c.id !== id);
//         } else {
//              // убавляем на единицу
//             cart.courses[idx].count--;
//         }

//         cart.price -= course.price;

//         // записываем обновленную корзину в базу
//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     // получаем ее в роутах
//                     resolve(cart)
//                 }
//             })
//         })

//     }
// }

// module.exports = Cart;