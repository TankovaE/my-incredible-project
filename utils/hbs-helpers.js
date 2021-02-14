module.exports = {
    // if equals, в handlebars в шаблоне нельзя просто так взять и сравнить 2 занчения
    // с помощью ===, директива ша проверяет только на наличие значения,
    // поэтому мы создаем хелпер, который сможем использовать в шаблоне, для сравнения значений
    ifeq (a, b, options) {
        if (String(a) === String(b)) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
}