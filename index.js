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
const ordersRoutes = require('./routes/orders');
const authRouter = require('./routes/auth');
const session = require('express-session');
// require возвращает определенную функцию, которую мы должны вызвать и передать ей пакет,
// который мы будем использовать для синхронизации,
// после этого данный конструктор (require('connect-mongodb-session')(session)) вернет нам класс,
// который мы сможем использовать для сохранения сессий в базе
const MongStore = require('connect-mongodb-session')(session);
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI = 'mongodb+srv://eitnkv:yKyonP8JZCOxEmye@cluster0.vdlvu.mongodb.net/shop';

//аналог объекта server
const app = express();

// создали экземпляр стора, который передадим в сессию
const store = new MongStore({
    // collections - имеется ввиду таблицы базы данных
    // здесь мы указываем таблицу, в которой хранятся сессии в mongodb
    collection: 'sessions',
    uri: MONGODB_URI,
})

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


//use позволяет добавлять мидлвейры (доп функциональность) для нашего приложения
//указываем, что папка public является публичной (статичной),
//в ней мы храним статичные объект, например, картинки или стили css
app.use(express.static(path.join(__dirname, 'public')));

//нужно для обработки запроса, в том числе получение body запроса
app.use(express.urlencoded({extended: true}))

// подключили специальный пакет для работы с сессиями пользователей
// пакет сам пишет куку с зашифрованным ключом сессии как только мы деаем req.session.save()
// он также удаляет куку, если сделан  req.session.destroy()
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

// подключаем свой middleware,
// который берет в запросе req.session новую переменную isAuthenticated
// и передает ее значение в res.locals.isAuth, которой будет пользоваться фронт
app.use(varMiddleware);

// middleware, который преобразовывает данные юзера сессии из базы
// в норм данные юзера
app.use(userMiddleware);

//используем роуты страниц
//первый параметр - префикс пути для всех роутов
//сделали, чтобы было понятно, для какого роута какой путь
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRouter)

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
        //обращаемся к пакету mongoose для того, чтобы подключиться к базе данных с помощью connect
        // useNewUrlParser нужен, чтобы не было разных ворнингов
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

        // если есть хоть 1 элемент, метод findOne его вернет
        // const candidate = await User.findOne();

        // if (!candidate) {
        //     const user = new User({
        //         email: 'eitnkv@gmail.com',
        //         name: 'Ekaterina',
        //         cart: {
        //             items: []
        //         }
        //     })
        //     await user.save();
        // }
    
        //на момент заруска приложения будет готова база данных
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (e) {
        console.log(e)
    }
}

start();

