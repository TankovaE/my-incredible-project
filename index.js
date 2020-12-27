const express = require('express');
const path = require('path');
//подключаем шаблонизатор
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const cartRoutes = require('./routes/cart');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const mongoose = require('mongoose');
const User = require('./models/user');


//аналог объекта server
const app = express();

//объект конфигурации handlebars
const hbs = exphbs.create({
    //стандартный лейаут
    //смотрит в папку с зарезервированным именем layouts
    defaultLayout: 'main',
    //сокращенное название модуля, для уоббства
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
});

//для того чтобы зарегистрировать данный модуль как движок для рендеринга html страниц
//первый параметр - имя, второй - значение
app.engine('hbs', hbs.engine);
//указываем, какой engine мы будем использовать
app.set('view engine', 'hbs');
//указывем, где хранятся шаблоны
//параметры - название и папка
app.set('views', 'views');


// пишем свой middleware для работы с user
// next позволяет продолжить выполнение цепочки мидлвеиров
// если мы его не вызовем, работа приложения остановится на нем
app.use(async (req, res, next) => {
   try { // хотим, чтобы с каждым запросом уходил пользователь
        const user = await User.findById('5fe8cb422cce6422f4b59419');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
})

//use позволяет добавлять мидлвейры (доп функциональность) для нашего приложения
//указываем, что папка public является публичной (статичной),
//в ней мы храним статичные объект, например, картинки или стили css
app.use(express.static(path.join(__dirname, 'public')));

//нужно для обработки запроса, в том числе получение body запроса
app.use(express.urlencoded({extended: true}))

//используем роуты страниц
//первый параметр - префикс пути для всех роутов
//сделали, чтобы было понятно, для какого роута какой путь
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)


//базовый метод который позволяет обрабатывать различные запросы
//первый параметр - адрес страницы, второй - это handler, который принимает 3 прараметра
//здесь мы отправляем в ответе на запрос get "/" статус 200 и отдаем страницу index.html
// app.get('/', (req, res, next) => {
//     //так мы рендерим страницы без hbs
//     // res.status(200);
//     // res.sendFile(path.join(__dirname, 'views', 'index.html'))

//     //так мы рендерим страницы с движком hbs
//     //метод render вторым параметром принимает параметры для страницы
//     res.render('index', {
//         //имя можно выбрать любое
//         title: 'Main page',
//         isHome: true,
//     });
// });

// app.get('/add', (req, res) => {
//     res.render('add', {
//         title: 'Add course',
//         isAdd: true
//     });
// });

// app.get('/courses', (req, res) => {
//     res.render('courses', {
//         title: 'Courses', 
//         isCourses: true,
//     });
// });


const PORT = process.env.PORT || 3000;




async function start() {
    try {
        const db = 'mongodb+srv://eitnkv:yKyonP8JZCOxEmye@cluster0.vdlvu.mongodb.net/shop';

        //обращаемся к пакету mongoose для того, чтобы подключиться к базе данных с помощью connect
        // useNewUrlParser нужен, чтобы не было разных ворнингов
        await mongoose.connect(db, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

        // если есть хоть 1 элемент, метод findOne его вернет
        const candidate = await User.findOne();

        if (!candidate) {
            const user = new User({
                email: 'eitnkv@gmail.com',
                name: 'Ekaterina',
                cart: {
                    items: []
                }
            })
            await user.save();
        }
    
        //на момент заруска приложения будет готова база данных
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (e) {
        console.log(e)
    }
}

start();

