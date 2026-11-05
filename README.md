README.MD para a tarefa 8 (descrição das funcionalidades):

# Arara e Brasa

## 1. Descrição do projeto

O **Arara e Brasa** é um projeto de desenvolvimento web que consiste na criação de um site institucional para um restaurante fictício especializado em culinária brasileira. O sistema foi desenvolvido com o objetivo de apresentar o estabelecimento, disponibilizar seu cardápio e demonstrar opções de delivery por meio de uma interface organizada e intuitiva.

O projeto busca aplicar conceitos fundamentais de desenvolvimento front-end, integrando estruturação de conteúdo, estilização visual e programação de funcionalidades interativas.

## 2. Objetivos

- Desenvolver uma interface web para apresentação de um estabelecimento comercial.
- Organizar as informações do restaurante em diferentes páginas.
- Apresentar os produtos do cardápio com imagens, descrições e preços.
- Implementar recursos interativos para melhorar a experiência de navegação.
- Aplicar conceitos de HTML, CSS e JavaScript em um projeto prático.

## 3. Estrutura do projeto

O site está organizado em três páginas principais:

### Página inicial (`index.html`)

Responsável pela apresentação institucional do restaurante. Contém informações sobre o estabelecimento, sua proposta gastronômica e sua identidade visual.

### Página do cardápio (`cardapio.html`)

Apresenta os pratos e produtos disponíveis, organizados visualmente para facilitar a consulta. Cada item possui informações como nome, descrição, imagem e preço.

A página também conta com janelas modais (*pop-ups*), que exibem informações adicionais sobre os alimentos, incluindo dados nutricionais estimados. Além disso, possui funcionalidades de carrinho de compras, permitindo adicionar produtos e acompanhar o valor total do pedido.

### Página de delivery (`delivery.html`)

Apresenta as opções de refeições disponíveis para entrega, utilizando elementos visuais e informações dos produtos para facilitar a identificação e a consulta das opções.

## 4. Tecnologias utilizadas

O desenvolvimento foi realizado utilizando tecnologias fundamentais do front-end:

- **HTML:** utilizado para estruturar o conteúdo das páginas, organizar seções, inserir imagens, textos, links e elementos de interação.
- **CSS:** responsável pela apresentação visual do site, incluindo cores, tipografia, espaçamentos, posicionamento dos elementos, estilização dos componentes e adaptação do layout a diferentes resoluções.
- **JavaScript:** utilizado para implementar comportamentos dinâmicos, como abertura e fechamento de janelas modais, interação com o cardápio e gerenciamento dos itens adicionados ao carrinho.

## 5. Funcionalidades implementadas

- Navegação entre as páginas do site.
- Apresentação institucional do restaurante.
- Exibição dos produtos do cardápio com imagens, descrições e preços.
- Janelas modais para consulta de informações detalhadas dos pratos.
- Exibição de informações nutricionais estimadas por refeição.
- Adição de produtos ao carrinho de compras.
- Atualização da quantidade de itens e do valor total do carrinho.
- Organização visual dos produtos disponíveis para delivery.
- Interface adaptável a diferentes tamanhos de tela.

## 6. Organização dos arquivos

A estrutura de diretórios do projeto está organizada da seguinte forma:

```text
Arara-e-Brasa/
│
├── index.html
├── cardapio.html
├── delivery.html
├── style.css
├── script.js
│
└── imgs/
    └── imagens utilizadas no projeto
```

Os arquivos HTML correspondem às páginas do site, enquanto o arquivo CSS centraliza as regras de estilização. O JavaScript concentra as funções responsáveis pelas interações e comportamentos dinâmicos. A pasta `imgs` armazena os recursos visuais utilizados na interface.

## 7. Informações nutricionais

Os dados nutricionais apresentados nos detalhes dos pratos são estimativas baseadas em referências brasileiras de composição de alimentos, como a Tabela Brasileira de Composição de Alimentos (TACO) e a Tabela Brasileira de Composição de Alimentos (TBCA).

Os valores são utilizados para fins informativos e podem variar de acordo com os ingredientes, métodos de preparo e tamanho das porções.

## 8. Execução do projeto

Para executar o projeto localmente:

1. Clone o repositório ou faça o download dos arquivos.
2. Extraia os arquivos, caso tenha realizado o download compactado.
3. Abra a pasta principal do projeto.
4. Execute o arquivo `index.html` em um navegador web.

Não é necessário configurar um servidor ou banco de dados para visualizar as páginas e utilizar as funcionalidades implementadas no front-end.

## 9. Considerações finais

O projeto Arara e Brasa representa a aplicação prática de conceitos de desenvolvimento front-end na construção de uma solução web voltada à apresentação de um estabelecimento comercial.

Durante seu desenvolvimento, foram trabalhados aspectos de estruturação de páginas, identidade visual, organização de conteúdo, responsividade e implementação de interações com JavaScript. O resultado é um site que integra diferentes páginas e funcionalidades em uma interface única, com foco na apresentação dos produtos e na experiência de navegação do usuário.