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
if (req.method === "GET") {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })

    // отправляем запрос на корневой url /
    res.end(`
        <h1>Form</h1>
        <form method="post" action="/">
        <input name="title" type="text"/>
        <button type="submit">send</button>
        </form>
    `)
} else if (req.method === 'POST') {
    const body = []

    //прописываем хедер заголовок для ответа, указываем кодировку, для правильного отображения кириллицы
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })

    //слушаем событие data
    req.on('data', data => {
        //Данные приходят в формате Buffer (разделенные на чанки)
        //для оптимизации процесса (полезно, когда передаваемые данные очень большие)
        body.push(Buffer.from(data))
    });

    //слушаем событие, когда все данные дошли (end)
    req.on('end', () => {
        //парсим ответ title=123
       const message = body.toString().split('=')[1]
    
       //завершаем и отдаем ответ
       res.end(`
            <h1>Ваше сообщение: ${message}</h1>
        `)
    })
}
});

//запускаем сервер, передаем порт и коллбек функцию, которая будет вызвана тогда, когда сервер будет запущен
server.listen(3000, () => {
    console.log('Server is running...')
})