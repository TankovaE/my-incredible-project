//path - это один из модулей, которые поставляются вместе с nodejs
const path = require('path');

//метод basename забирает название файла из абсолютного пути
//filename - название текущего файла
console.log(path.basename(__filename))
//path_ref.js

//метод dirname позволяет получить путь до файла
console.log(path.dirname(__filename))
//C:\code\my-incredible-project\refs


//метод extname позволяет получить расширение файла
console.log(path.extname(__filename))
//.js

//работает с путями и названиями файлов как с объетом
console.log(path.parse(__filename))
//{ root: 'C:\\',
// dir: 'C:\\code\\my-incredible-project\\refs',
// base: 'path_ref.js',
// ext: '.js',
// name: 'path_ref' }

//позволяет соединить строки в путь
console.log(path.join(__dirname, 'test', 'second.html' ))
//C:\code\my-incredible-project\refs\test\second.html

//генерируем путь, работает с относительными и абсолютными путями
console.log(path.resolve(__dirname, './test', '/second.html'))
//C:\second.html