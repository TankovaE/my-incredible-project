// каждый модуль node js заворачивает в самовызывающуюся функцию, и передает ей переменные, которые считаются глобальными
// (function(require, module, exports, __filename, __dirname) {
    const obj = require('./user');
    console.log( obj);
    obj.sayHello()
// })()

//настраиваем сервера
const http = require('http');

//методу createSever передается функция - handler, которая будет вызываться, когда будут идти запросы на сервер
//принимает 2 параметра запрос и ответ
const server = http.createServer((req, res) => {
    console.log(req.url)

    //передаем контент (на http://localhost:3000/ смотрим результат)
    res.write('<h1>Hello from NodeJS</h1>');
    res.write('<h2>Hello from NodeJS</h2>');
    res.write('<h3>Hello from NodeJS</h3>');
    //закрываем процесс, вызывается в конце
    //этот метод тоже принимает контент
    res.end('<div style="background: red; width: 200px; height: 200px;">test</div>')
});

//запускаем сервер, передаем порт и коллбек функцию, которая будет вызвана тогда, когда сервер будет запущен
server.listen(3000, () => {
    console.log('Server is running...')
})