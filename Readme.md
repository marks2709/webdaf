README.MD para a tarefa 8 (descrição das funcionalidades):

# Arara & Brasa

Site de cardápio e pedidos online do restaurante Arara & Brasa.
O cliente navega pelo cardápio, vê detalhes e informações nutricionais,
monta um carrinho e envia o pedido pelo WhatsApp.


## Funcionalidades

1. Menu de navegação (mobile)
2. Carrinho de compras
3. Finalização do pedido via WhatsApp
4. Animações de entrada ao rolar a página
5. Pop-up com informações nutricionais estimadas

1. Menu de navegação

- Alterna a classe `open` no elemento `#menu`.
- Verifica se o elemento existe antes de agir.

2. Carrinho de compras

Funções: `addToCart()`, `updateCart()`, `removeFromCart()`

- `addToCart(nome, preço)` adiciona o prato ao array `cart`.
- `updateCart()` redesenha o carrinho:
  - atualiza o contador (`#cart-count`);
  - mostra mensagem de carrinho vazio quando não há itens;
  - lista cada item com preço em reais (ex.: `R$ 25,90`);
  - calcula o total em `#cart-total`.
- `removeFromCart(index)` remove um item pelo botão **✕**.


3. Pedido via WhatsApp

Função: `finishOrder()`

- Se o carrinho estiver vazio, mostra um alerta e interrompe.
- Monta uma mensagem com a lista de itens, preços e total em negrito.
- Abre `https://wa.me/<telefone>?text=<mensagem>` em nova aba.



4. Animações ao rolar a página

- Usa `IntersectionObserver` com `threshold: 0.15`.
- Aplica fade-in com deslocamento vertical de 20px.
- Elementos animados: `.specialty-card`, `.menu-item`, `.delivery-card`.



5. Pop-up de detalhes do produto

Ao clicar em um `.menu-item` com `data-nome`, abre o modal
`#produto-modal` com nome, descrição, preço, imagem e dados nutricionais.


**Fechar o modal:** botão `#modal-fechar`, clique fora ou tecla **Esc**.

**Adicionar:** o botão `#modal-adicionar` converte o preço (ex.:
`R$ 600,00`) em número, chama `addToCart()` e fecha o modal.
