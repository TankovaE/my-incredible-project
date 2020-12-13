
// клиентский js
// здесь мы форматируем цену, чтобы она вглядела красиво
document.querySelectorAll('.price').forEach(node => {
    console.log(node.textContent);
    node.textContent = new Intl.NumberFormat('ru-RU', {currency: 'rub', style: 'currency'}).format(node.textContent);
})

const $cart = document.querySelector('#cart');

if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            
            fetch(`/cart/remove/${id}`, {
                method: 'delete',
                //метод fetch возвращает промис
            }).then(res => res.json()).then(cart => {
                console.log(cart)
            })
        }
    })
}