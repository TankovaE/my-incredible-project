
// клиентский js
// здесь мы форматируем цену, чтобы она вглядела красиво
document.querySelectorAll('.price').forEach(node => {
    console.log(node.textContent);
    node.textContent = new Intl.NumberFormat('ru-RU', {currency: 'rub', style: 'currency'}).format(node.textContent);
})