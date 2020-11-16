const path = require('path')
//модуль fs работает с файловой системой
const fs = require('fs');

//создаем папку
fs.mkdir(path.join(__dirname, 'notes'), (err) => {
    if (err) throw err;

    console.log('Папка была создана')
})

//созаем файл mynotes.tx с контентом 'Файл был создан'
fs.writeFile(
    path.join(__dirname, 'notes', 'mynotes.txt'),
    "Hello world",
    (err) => {
        if (err) throw err;
        console.log('Файл был создан');

        //добавляем контент в файл
        fs.appendFile(path.join(__dirname, 'notes', 'mynotes.txt'),
        ' From append file', 

        err => {
            if (err) throw err;
            console.log('Файл был изменен')
        }
        )
    }    
);

//считываем файлы
//<Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64>
//складываем файл частями в буфер для оптимизации
fs.readFile(
    path.join(__dirname, 'notes', 'mynotes.txt'),
    //если указать во втором параметре кодировку, не понадобится преобразовывать Buffer
    'utf-8',
    (err, data) => {
        if (err) throw err;
        //Считываем контент файла, преобразуя Buffer
        console.log(Buffer.from(data).toString());
    }
);

//переименовываем файл
fs.rename(
    //путь со старым именем
    path.join(__dirname, 'notes', 'mynotes.txt'),
    //путь с новым именем
    path.join(__dirname, 'notes', 'notes.txt'),
    err => {
        if (err) throw err;
        console.log('Файл был переименован');
    }
);


