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

// Pop-ups do cardápio com informações nutricionais estimadas
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("produto-modal");
    if (!modal) return;

    const campos = {
        kcal: document.getElementById("nutri-kcal"),
        proteina: document.getElementById("nutri-proteina"),
        carboidratos: document.getElementById("nutri-carboidratos"),
        gorduras: document.getElementById("nutri-gorduras"),
        fibras: document.getElementById("nutri-fibras"),
        sodio: document.getElementById("nutri-sodio")
    };
    let produtoAtual = null;

    document.querySelectorAll(".menu-item[data-nome]").forEach((item) => {
        item.addEventListener("click", () => {
            produtoAtual = item;
            document.getElementById("modal-nome").textContent = item.dataset.nome || "";
            document.getElementById("modal-descricao").textContent = item.dataset.descricao || "";
            document.getElementById("modal-preco").textContent = item.dataset.preco || "";
            const imagem = document.getElementById("modal-imagem");
            imagem.src = item.dataset.imagem || "";
            imagem.alt = item.dataset.nome || "Imagem do prato";
            campos.kcal.textContent = `${item.dataset.kcal || "—"} kcal`;
            campos.proteina.textContent = `${item.dataset.proteina || "—"} g`;
            campos.carboidratos.textContent = `${item.dataset.carboidratos || "—"} g`;
            campos.gorduras.textContent = `${item.dataset.gorduras || "—"} g`;
            campos.fibras.textContent = `${item.dataset.fibras || "—"} g`;
            campos.sodio.textContent = `${item.dataset.sodio || "—"} mg`;
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
        });
    });

    const fechar = () => { modal.classList.remove("active"); modal.setAttribute("aria-hidden", "true"); };
    document.getElementById("modal-fechar")?.addEventListener("click", fechar);
    modal.addEventListener("click", (event) => { if (event.target === modal) fechar(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") fechar(); });
    document.getElementById("modal-adicionar")?.addEventListener("click", () => {
        if (!produtoAtual) return;
        const preco = Number((produtoAtual.dataset.preco || "").replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
        addToCart(produtoAtual.dataset.nome, preco);
        fechar();
    });
});
