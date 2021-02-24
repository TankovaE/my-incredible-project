const multer = require('multer');

// middleware для обработки загрузки файлов

// diskStorage принимает объект, где мы можем задать определенные функции, которые будут вызваны в процессе того,
// как файл будет загружаться
const storage = multer.diskStorage({
    // задаем место, куда нужно разместить файл
    destination(req, file, callback) {
        //первый параметр для ошибки
        callback(null, 'images')
    },
    // задаем, какое имя нужно присвоить загруженному файлу
    filename(req, file, callback) {
        //первый параметр для ошибки
        callback(null, `${new Date().toISOString}-${file.originalname}` )
    }

});

// массив строк, тех mime типов, которые разрешены для нашего файла
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

// функция - валидатор для файлов, здесь мы модем ограничить принимаемые расширени файлов
const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        // второй параметр со значением true говорит о том, что валидация прошла успешно
        callback(null, true)
    } else {
        callback(null, false)
    }
} 

module.exports = multer({
    storage,
    fileFilter
})