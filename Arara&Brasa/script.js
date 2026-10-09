function toggleMenu() {
    const menu = document.getElementById("menu");

    if (menu) {
        menu.classList.toggle("open");
    }
}

let cart = JSON.parse(localStorage.getItem("araraCart") || "[]");

function addToCart(name, price) {
    cart.push({
        name: name,
        price: Number(price)
    });

    localStorage.setItem("araraCart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );

    if (cartTotal) {
        cartTotal.textContent =
            "R$ " + total.toFixed(2).replace(".", ",");
    }

    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <img src="imgs/araraab.png" alt="Mascote Arara e Brasa">
                <p>Seu carrinho está vazio.</p>
                <small>Adicione algum prato para começar.</small>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        const info = document.createElement("div");

        const nome = document.createElement("h4");
        nome.textContent = item.name;

        const preco = document.createElement("small");
        preco.textContent =
            "R$ " + Number(item.price).toFixed(2).replace(".", ",");

        info.appendChild(nome);
        info.appendChild(preco);

        const remover = document.createElement("button");
        remover.classList.add("remove-item");
        remover.type = "button";
        remover.textContent = "✕";
        remover.setAttribute("aria-label", "Remover " + item.name);

        remover.addEventListener("click", () => removeFromCart(index));

        div.appendChild(info);
        div.appendChild(remover);
        cartItems.appendChild(div);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);

    localStorage.setItem("araraCart", JSON.stringify(cart));
    updateCart();
}

function finishOrder() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio! Adicione algum prato.");
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
            Number(item.price).toFixed(2).replace(".", ",") +
            "%0A";

        total += Number(item.price);
    });

    message +=
        "%0A*Total: R$ " +
        total.toFixed(2).replace(".", ",") +
        "*";

    const phone = "5511999999999";

    const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        message;

    window.open(url, "_blank");
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    },
    {
        threshold: 0.15
    }
);

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(
        ".specialty-card, .menu-item, .delivery-card"
    );

    elements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "all .5s ease";

        observer.observe(element);
    });
});

const modal = document.getElementById("produto-modal");
const modalImagem = document.getElementById("modal-imagem");
const modalNome = document.getElementById("modal-nome");
const modalDescricao = document.getElementById("modal-descricao");
const modalPreco = document.getElementById("modal-preco");
const botaoFechar = document.getElementById("modal-fechar");
const botaoAdicionar = document.getElementById("modal-adicionar");

if (
    modal &&
    modalImagem &&
    modalNome &&
    modalDescricao &&
    modalPreco &&
    botaoFechar &&
    botaoAdicionar
) {
    document.querySelectorAll(".menu-item[data-nome]").forEach((card) => {
        card.addEventListener("click", () => {
            modalNome.textContent = card.dataset.nome;
            modalDescricao.textContent = card.dataset.descricao;
            modalPreco.textContent = card.dataset.preco;
            modalImagem.src = card.dataset.imagem;
            modalImagem.alt = card.dataset.nome;

            botaoAdicionar.textContent = "🛒 Adicionar ao carrinho";
            botaoAdicionar.style.backgroundColor = "#164832";

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";

            botaoFechar.focus();
        });
    });

    function fecharModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    botaoFechar.addEventListener("click", fecharModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            fecharModal();
        }
    });

    botaoAdicionar.addEventListener("click", () => {
        const nome = modalNome.textContent;

        const preco = Number(
            modalPreco.textContent
                .replace(/[^\d,]/g, "")
                .replace(",", ".")
        );

        addToCart(nome, preco);

        botaoAdicionar.textContent = "✓ Adicionado ao carrinho";
        botaoAdicionar.style.backgroundColor = "#e87528";
    });
}

updateCart();