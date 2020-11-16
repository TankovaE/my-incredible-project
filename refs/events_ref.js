//позволяет прослушивать события в асинхронном режиме
const EventEmitter = require('events');

class Logger extends EventEmitter {
    log(message) {
        this.emit('message', `${message} ${Date.now()}`)
    }
}

const logger = new Logger();

//ставим прослушку события message
logger.on('message', data => {
    console.log(data);
});

//эмитим
logger.log('Hello');
