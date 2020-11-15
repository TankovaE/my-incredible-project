// каждый модуль node js заворачивает в самовызывающуюся функцию, и передает ей переменные, которые считаются глобальными
// (function(require, module, exports, __filename, __dirname) {
    const obj = require('./user');
    console.log( obj);
    obj.sayHello()
// })()

