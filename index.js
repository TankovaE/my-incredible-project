const express = require('express');
const path = require('path');
//подключаем шаблонизатор
const exphbs = require('express-handlebars');

//аналог объекта server
const app = express();

//объект конфигурации handlebars
const hbs = exphbs.create({
    //стандартный лейаут
    //смотрит в папку с зарезервированным именем layouts
    defaultLayout: 'main',
    //сокращенное название модуля, для уоббства
    extname: 'hbs'
});

//для того чтобы зарегистрировать данный модуль как движок для рендеринга html страниц
//первый параметр - имя, второй - значение
app.engine('hbs', hbs.engine);
//указываем, какой engine мы будем использовать
app.set('view engine', 'hbs');
//указывем, где хранятся шаблоны
//параметры - название и папка
app.set('views', 'views');

//use позволяет добавлять мидлвейпы (доп функциональность) для нашего приложения
//указываем, что папка public является публичной (статичной),
//в ней мы храним статичные объект, например, картинки или стили css
app.use(express.static('public'));


//базовый метод который позволяет обрабатывать различные запросы
//первый параметр - адрес страницы, второй - это handler, который принимает 3 прараметра
//здесь мы отправляем в ответе на запрос get "/" статус 200 и отдаем страницу index.html
app.get('/', (req, res, next) => {
    //так мы рендерим страницы без hbs
    // res.status(200);
    // res.sendFile(path.join(__dirname, 'views', 'index.html'))

    //так мы рендерим страницы с движком hbs
    res.render('index');
});

app.get('/about', (req, res) => {
    //так мы рендерим страницы без hbs
    // res.sendFile(path.join(__dirname, 'views', 'about.html'))

    //так мы рендерим страницы с движком hbs
    res.render('about');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
