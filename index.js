const express = require('express');
const path = require('path');
//аналог объекта server
const app = express();

//базовый метод который позволяет обрабатывать различные запросы
//первый параметр - адрес страницы, второй - это handler, который принимает 3 прараметра
//здесь мы отправляем в ответе на запрос get "/" статус 200 и отдаем страницу index.html
app.get('/', (req, res, next) => {
    res.status(200);
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
