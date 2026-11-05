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
    atualizarBotaoCarrinho();
}

function addToCart(nome, preco) {
    try {
        adicionarAoCarrinho(nome, preco, '');
    } catch (e) {
        console.error('Erro ao adicionar ao carrinho:', e);
        alert('Erro ao adicionar item. Veja o console (F12).');
    }
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
    renderizarUpsell();
}

function alterarQuantidade(index, delta) {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotaoCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotaoCarrinho();
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
        `Olá, Arara & Brasa!\n` +
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

function atualizarBotaoCarrinho() {
    try {
        const btn = document.getElementById('cart-float');
        if (!btn) return;

        const badge = btn.querySelector('.cart-badge');
        if (!badge) return;

        const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
        badge.textContent = totalItens > 0 ? totalItens : '';
        badge.dataset.count = totalItens;
    } catch (e) {
        console.warn('Erro ao atualizar botão do carrinho:', e);
    }
}

function criarBotaoCarrinho() {
    if (document.getElementById('cart-items')) return;
    if (document.getElementById('cart-float')) return;

    const btn = document.createElement('a');
    btn.id = 'cart-float';
    btn.href = 'delivery.html';
    btn.setAttribute('aria-label', 'Ir para o carrinho');
    btn.classList.add('visible');
    btn.innerHTML = `
        <span class="cart-icon" aria-hidden="true">🛒</span>
        <span class="cart-badge" data-count="0"></span>
    `;

    document.body.appendChild(btn);
    atualizarBotaoCarrinho();
}

/* ===== MODO ESCURO ===== */
function carregarTema() {
    try {
        const tema = localStorage.getItem('araraTema');
        if (tema === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } catch (e) {}
}

function toggleTema() {
    document.body.classList.toggle('dark-mode');
    try {
        localStorage.setItem('araraTema',
            document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        );
    } catch (e) {}
    atualizarIconeTema();
}

function atualizarIconeTema() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

function criarBotaoTema() {
    const header = document.querySelector('.header');
    if (!header) return;
    if (document.getElementById('theme-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Alternar modo escuro');
    btn.onclick = toggleTema;
    header.appendChild(btn);
    atualizarIconeTema();
}

/* ===== FAVORITOS ===== */
let favoritos = [];

function carregarFavoritos() {
    try {
        const raw = localStorage.getItem('araraFavoritos');
        if (raw) favoritos = JSON.parse(raw) || [];
    } catch (e) {
        favoritos = [];
    }
}

function salvarFavoritos() {
    try {
        localStorage.setItem('araraFavoritos', JSON.stringify(favoritos));
    } catch (e) {}
}

function toggleFavorito(nome) {
    const idx = favoritos.indexOf(nome);
    if (idx >= 0) {
        favoritos.splice(idx, 1);
    } else {
        favoritos.push(nome);
    }
    salvarFavoritos();
    atualizarBotoesFavorito();
    filtrarCardapio();
}

function atualizarBotoesFavorito() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const nome = btn.dataset.nome;
        const ativo = favoritos.includes(nome);
        btn.classList.toggle('favoritado', ativo);
        btn.textContent = ativo ? '❤️' : '🤍';
    });
}

function criarBotoesFavorito() {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.querySelector('.fav-btn')) return;
        const nome = item.dataset.nome;
        if (!nome) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fav-btn';
        btn.dataset.nome = nome;
        btn.setAttribute('aria-label', 'Adicionar aos favoritos');
        btn.textContent = favoritos.includes(nome) ? '❤️' : '🤍';
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorito(nome);
        };
        item.appendChild(btn);
    });
}

/* ===== BUSCA + FILTRO ===== */
let filtroAtual = 'todos';
let somenteFavoritos = false;

function filtrarCardapio() {
    const buscaInput = document.getElementById('menu-busca');
    const termo = (buscaInput ? buscaInput.value : '').toLowerCase().trim();

    const categorias = document.querySelectorAll('.menu-category');
    let totalVisivel = 0;

    categorias.forEach(cat => {
        const titulo = cat.querySelector('h2')?.textContent.trim() || '';
        const catKey = titulo.toLowerCase();

        const correspondeFiltro =
            filtroAtual === 'todos' ||
            catKey.includes(filtroAtual);

        const itens = cat.querySelectorAll('.menu-item');
        let visiveisNaCat = 0;

        itens.forEach(item => {
            const nome = (item.dataset.nome || '').toLowerCase();
            const desc = (item.dataset.descricao || '').toLowerCase();
            const nomeOriginal = item.dataset.nome || '';

            const bateBusca = !termo || nome.includes(termo) || desc.includes(termo);
            const bateFiltro = correspondeFiltro;
            const bateFavorito = !somenteFavoritos || favoritos.includes(nomeOriginal);

            const visivel = bateBusca && bateFiltro && bateFavorito;
            item.classList.toggle('hidden', !visivel);
            if (visivel) visiveisNaCat++;
        });

        cat.classList.toggle('hidden', visiveisNaCat === 0);
        totalVisivel += visiveisNaCat;
    });

    const semResult = document.getElementById('sem-resultados');
    if (semResult) {
        semResult.style.display = totalVisivel === 0 ? 'block' : 'none';
    }
}

function setupFiltros() {
    const buscaInput = document.getElementById('menu-busca');
    if (buscaInput) {
        buscaInput.addEventListener('input', filtrarCardapio);
    }

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.dataset.filtro;

            if (tipo === 'favoritos') {
                somenteFavoritos = !somenteFavoritos;
                btn.classList.toggle('ativo', somenteFavoritos);
            } else {
                filtroAtual = tipo;
                document.querySelectorAll('.filtro-btn').forEach(b => {
                    if (b.dataset.filtro !== 'favoritos') {
                        b.classList.toggle('active', b.dataset.filtro === tipo);
                    }
                });
            }

            filtrarCardapio();
        });
    });
}

/* ===== UPSELL NO CARRINHO ===== */
const sugestoes = [
    { nome: 'Farofa da Casa', preco: 12.90, desc: 'Combina com carnes na brasa' },
    { nome: 'Batata Frita', preco: 18.90, desc: 'Porção crocante e sequinha' },
    { nome: 'Pudim da Casa', preco: 14.90, desc: 'Sobremesa cremosa' },
    { nome: 'Cocada Cremosa', preco: 13.90, desc: 'Doce tradicional brasileiro' }
];

function renderizarUpsell() {
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartFooter) return;

    let upsellEl = document.getElementById('sugestao-upsell');
    if (!upsellEl) {
        upsellEl = document.createElement('div');
        upsellEl.id = 'sugestao-upsell';
        upsellEl.className = 'sugestao-upsell';
        cartFooter.parentNode.insertBefore(upsellEl, cartFooter);
    }

    if (carrinho.length === 0) {
        upsellEl.style.display = 'none';
        return;
    }

    const nomesNoCarrinho = carrinho.map(i => i.nome);
    const filtradas = sugestoes.filter(s => !nomesNoCarrinho.includes(s.nome)).slice(0, 2);

    if (filtradas.length === 0) {
        upsellEl.style.display = 'none';
        return;
    }

    upsellEl.style.display = 'block';
    upsellEl.innerHTML = '<strong>💡 Que tal adicionar?</strong>' +
        filtradas.map(s => `
            <div class="sugestao-upsell-item">
                <p>${s.nome}<small>${s.desc}</small></p>
                <button onclick="addToCart('${s.nome.replace(/'/g, "\\'")}', ${s.preco})">
                    + ${formatarPreco(s.preco)}
                </button>
            </div>
        `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    carregarTema();
    criarBotaoTema();

    carregarCarrinho();
    renderizarCarrinho();
    criarBotaoCarrinho();

    carregarFavoritos();
    criarBotoesFavorito();
    atualizarBotoesFavorito();

    const temModal = document.getElementById('produto-modal');
    if (temModal) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => abrirModal(item));
        });
    }

    setupFiltros();

    const btnFechar = document.getElementById('modal-fechar');
    if (btnFechar) btnFechar.addEventListener('click', fecharModal);

    if (temModal) {
        temModal.addEventListener('click', (e) => {
            if (e.target === temModal) fecharModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });

    const btnAdd = document.getElementById('modal-adicionar');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            if (!produtoAtual) return;

            const nomeAdicionado = produtoAtual.nome;
            const obsEl = document.getElementById('modal-observacao');
            const obs = obsEl ? obsEl.value : '';

            adicionarAoCarrinho(produtoAtual.nome, produtoAtual.preco, obs);

            btnAdd.textContent = '✅ Adicionado!';
            setTimeout(() => {
                btnAdd.textContent = '🛒 Adicionar ao carrinho';
            }, 1200);

            fecharModal();

            if (!document.getElementById('cart-items')) {
                mostrarToast(`${nomeAdicionado} adicionado ao carrinho!`);
            }
        });
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'araraCarrinho') {
            carregarCarrinho();
            renderizarCarrinho();
            atualizarBotaoCarrinho();
            renderizarUpsell();
        }
        if (e.key === 'araraFavoritos') {
            carregarFavoritos();
            atualizarBotoesFavorito();
        }
    });
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