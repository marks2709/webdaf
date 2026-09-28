function toggleMenu() {

    const menu = document.getElementById("menu");

    if (menu) {

        menu.classList.toggle("open");

    }

}


let cart = [];


function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    updateCart();

}


function updateCart() {

    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");

    const cartTotal = document.getElementById("cart-total");


    if (!cartItems) {
        return;
    }


    cartCount.textContent = cart.length;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <img src="imgs/araraab.png" alt="Mascote Arara e Brasa">

                <p>
                    Seu carrinho está vazio.
                </p>

                <small>
                    Adicione algum prato para começar.
                </small>

            </div>

        `;

        cartTotal.textContent = "R$ 0,00";

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price;


        const div = document.createElement("div");

        div.classList.add("cart-item");


        div.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <small>
                    R$ ${item.price.toFixed(2).replace(".", ",")}
                </small>

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})">

                ✕

            </button>

        `;


        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        "R$ " +
        total.toFixed(2).replace(".", ",");

}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


function finishOrder() {

    if (cart.length === 0) {

        alert(
            "Seu carrinho está vazio! Adicione algum prato."
        );

        return;

    }


    let message =
        "Olá! Gostaria de fazer um pedido no Arara & Brasa:%0A%0A";


    let total = 0;


    cart.forEach((item) => {

        message +=
            "• " +
            item.name +
            " - R$ " +
            item.price.toFixed(2).replace(".", ",") +
            "%0A";

        total += item.price;

    });


    message +=
        "%0A*Total: R$ " +
        total.toFixed(2).replace(".", ",") +
        "*";


    const phone =
        "5511999999999";


    const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        message;


    window.open(url, "_blank");

}

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },

        {
            threshold: 0.15
        }

    );


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const elements =
            document.querySelectorAll(
                ".specialty-card, .menu-item, .delivery-card"
            );


        elements.forEach((element) => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "all .5s ease";


            observer.observe(element);

        });

    }
);