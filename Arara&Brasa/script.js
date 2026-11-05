function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) menu.classList.toggle('open');
}

let carrinho = [];

function salvarCarrinho() {
    try {
        localStorage.setItem('araraCarrinho', JSON.stringify(carrinho));
    } catch (e) {}
}

function carregarCarrinho() {
    try {
        const raw = localStorage.getItem('araraCarrinho');
        if (raw) carrinho = JSON.parse(raw) || [];
    } catch (e) {
        carrinho = [];
    }
}

function formatarPreco(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function normalizarObservacao(obs) {
    return (obs || '').trim();
}

function adicionarAoCarrinho(nome, preco, observacao) {
    const obs = normalizarObservacao(observacao);
    const existente = carrinho.find(
        item => item.nome === nome && item.observacao === obs
    );

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({
            nome,
            preco: Number(preco),
            quantidade: 1,
            observacao: obs
        });
    }

    salvarCarrinho();
    renderizarCarrinho();
}

function addToCart(nome, preco) {
    adicionarAoCarrinho(nome, preco, '');
}

function renderizarCarrinho() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    if (!container) return;

    const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    if (countEl) countEl.textContent = totalItens;

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <img src="imgs/araraab.png" alt="Mascote Arara e Brasa">
                <p>Seu carrinho está vazio.</p>
                <small>Adicione algum prato para começar.</small>
            </div>`;
        if (totalEl) totalEl.textContent = formatarPreco(0);
        return;
    }

    let html = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong class="cart-item-nome">${item.nome}</strong>
                    ${item.observacao
                        ? `<p class="cart-item-obs">📝 ${item.observacao}</p>`
                        : ''}
                    <span class="cart-item-preco">${formatarPreco(item.preco)} un.</span>
                </div>

                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="alterarQuantidade(${index}, -1)" aria-label="Remover um">−</button>
                    <span class="qty-value">${item.quantidade}</span>
                    <button class="qty-btn" onclick="alterarQuantidade(${index}, 1)" aria-label="Adicionar um">+</button>
                    <button class="remove-btn" onclick="removerItem(${index})" aria-label="Remover item">🗑</button>
                </div>

                <div class="cart-item-subtotal">${formatarPreco(subtotal)}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalEl) totalEl.textContent = formatarPreco(total);
}

function alterarQuantidade(index, delta) {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    salvarCarrinho();
    renderizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

function finishOrder() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione algum prato antes de finalizar.');
        return;
    }

    const numeroWhats = '5511999999999';

    let total = 0;
    const linhas = [];

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const obs = item.observacao ? ` (${item.observacao})` : '';
        linhas.push(
            `- ${item.quantidade}x ${item.nome}${obs} — ${formatarPreco(subtotal)}`
        );
    });

    const mensagem =
        `Olá, Arara & Brasa! 🦜🔥\n` +
        `Gostaria de fazer o seguinte pedido:\n\n` +
        linhas.join('\n') +
        `\n\n*Total: ${formatarPreco(total)}*\n\n` +
        `Aguardo a confirmação. Obrigado(a)!`;

    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

let produtoAtual = null;

function abrirModal(item) {
    const modal = document.getElementById('produto-modal');
    if (!modal) return;

    produtoAtual = {
        nome: item.dataset.nome,
        preco: parseFloat(
            (item.dataset.preco || '0')
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ),
        descricao: item.dataset.descricao,
        imagem: item.dataset.imagem
    };

    document.getElementById('modal-imagem').src = produtoAtual.imagem;
    document.getElementById('modal-imagem').alt = produtoAtual.nome;
    document.getElementById('modal-nome').textContent = produtoAtual.nome;
    document.getElementById('modal-descricao').textContent = produtoAtual.descricao;
    document.getElementById('modal-preco').textContent = item.dataset.preco;

    const mapa = {
        'nutri-kcal': 'kcal',
        'nutri-proteina': 'proteina',
        'nutri-carboidratos': 'carboidratos',
        'nutri-gorduras': 'gorduras',
        'nutri-fibras': 'fibras',
        'nutri-sodio': 'sodio'
    };

    Object.entries(mapa).forEach(([idEl, chave]) => {
        const el = document.getElementById(idEl);
        if (!el) return;
        const valor = item.dataset[chave];
        if (chave === 'kcal') el.textContent = valor ? `${valor} kcal` : '—';
        else if (chave === 'sodio') el.textContent = valor ? `${valor} mg` : '—';
        else el.textContent = valor ? `${valor} g` : '—';
    });

    const obsEl = document.getElementById('modal-observacao');
    if (obsEl) obsEl.value = '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function fecharModal() {
    const modal = document.getElementById('produto-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    produtoAtual = null;
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    renderizarCarrinho();

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => abrirModal(item));
    });

    const btnFechar = document.getElementById('modal-fechar');
    if (btnFechar) btnFechar.addEventListener('click', fecharModal);

    const modal = document.getElementById('produto-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });

    const btnAdd = document.getElementById('modal-adicionar');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            if (!produtoAtual) return;

            const obsEl = document.getElementById('modal-observacao');
            const obs = obsEl ? obsEl.value : '';

            adicionarAoCarrinho(produtoAtual.nome, produtoAtual.preco, obs);

            btnAdd.textContent = '✅ Adicionado!';
            setTimeout(() => {
                btnAdd.textContent = '🛒 Adicionar ao carrinho';
            }, 1200);

            fecharModal();

            if (!document.getElementById('cart-items')) {
                mostrarToast(`${produtoAtual?.nome || 'Item'} adicionado ao carrinho!`);
            }
        });
    }
});

function mostrarToast(msg) {
    let toast = document.getElementById('toast-arara');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-arara';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}