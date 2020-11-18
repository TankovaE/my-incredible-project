console.log(process.argv)

function consoleToJSON() {
    const c = {};

    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i].split('=');
        c[arg[0]] = arg[1] ? arg[1] : true;
    };

    return c;
}

console.log(consoleToJSON())

//запускаем в консоли node console.js message=hello spec
//получаем
// [ 'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\code\\my-incredible-project\\console.js',
//   'message=hello',
//   'spec' ]