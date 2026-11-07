# 🔴 Pokédex: Kanto 151

Uma Pokédex feita com **HTML, CSS e JavaScript puro**, sem frameworks e sem nenhuma biblioteca de fora. Ela mostra os **151 pokémons da primeira geração** (do Bulbasaur ao Mew), busca os dados na **PokéAPI** e tem o visual de um aparelho de verdade: carcaça vermelha, lente azul, visor verde, direcional e botões.

> 🎉 **Parabéns ao autor do projeto original** pela ideia e pela base tão bem pensada para quem está aprendendo JavaScript. Esta versão nasceu dela e mantém a mesma estrutura de arquivos. Veja os créditos no final.

---

## 🎮 Como usar

1. Abra a Pokédex e veja a lista de pokémons na tela.
2. Escolha um pokémon com o **direcional** (ou as **setas do teclado**).
3. Aperte **A** (ou **Enter**) para abrir os detalhes.
4. Aperte **B** (ou **Esc**) para voltar para a lista.
5. Clique em **Carregar mais** para ver os próximos pokémons.
6. Quer um pokémon específico? Digite o **nome** ou o **número** (de 1 a 151) na busca e clique em **Ir**.

### Os controles

| Controle | Na lista | Nos detalhes |
|---|---|---|
| **Direcional / setas** | Move o destaque entre os pokémons | Troca para o pokémon anterior ou o próximo |
| **A / Enter** | Abre os detalhes | Toca o grito do pokémon |
| **B / Esc** | Não faz nada | Volta para a lista |
| **Carregar mais** | Mostra mais 12 pokémons | Não faz nada |

---

## ✨ O que a Pokédex tem

- **Visual de Pokédex de verdade**: carcaça vermelha, lente azul que pulsa, LEDs piscando, moldura prateada e tela com efeito de "ligar".
- **Lista com cartões coloridos** de acordo com o tipo de cada pokémon.
- **Tela de detalhes** com a imagem grande, tipos em português, altura, peso, habilidades e as **6 barras de status** (HP, ataque, defesa, ataque especial, defesa especial e velocidade).
- **Grito do pokémon**: um botão toca o som de cada um.
- **Busca** por nome ou número, com mensagem de erro quando o pokémon não existe na primeira geração.
- **Visor verde** que mostra o pokémon selecionado e dicas de uso.
- **Funciona no celular**: o layout se reorganiza para telas pequenas.
- **Aviso de erro** quando não há internet, em vez de uma tela vazia.

---

## 🔍 Como funciona (explicação simples)

### De onde vêm os dados
A Pokédex não guarda nenhum pokémon dentro do código. Tudo vem da **[PokéAPI](https://pokeapi.co/)**, um serviço gratuito na internet. O caminho dos dados é este:

1. O `main.js` pede à API a **lista** dos próximos 12 pokémons (só nome e endereço).
2. Para cada um, o `poke-api.js` faz **outro pedido** com os detalhes completos: número, tipos, imagens, status e o resto.
3. Cada resposta vira um objeto da classe `Pokemon` (definida no `pokemon-model.js`).
4. O `main.js` desenha os cartões na tela com esses objetos.

### Os arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Monta o aparelho: lente, tela, direcional, visor e botões. |
| `assets/css/global.css` | Estilos básicos da página e o fundo escuro. |
| `assets/css/pokedex.css` | Todo o visual da Pokédex: carcaça, tela, cartões, detalhes e animações. |
| `assets/js/pokemon-model.js` | Define a classe `Pokemon`, o "molde" com os dados de cada um. |
| `assets/js/poke-api.js` | Conversa com a PokéAPI e transforma as respostas em objetos `Pokemon`. |
| `assets/js/main.js` | Controla tudo: lista, seleção, detalhes, busca, teclado e botões. |

### Como a tela troca entre lista e detalhes
Existem dois "blocos" dentro da tela: a **lista** e os **detalhes**. Só um aparece de cada vez. Quando você abre um pokémon, a lista é escondida e os detalhes são mostrados. Ao voltar, acontece o contrário, e o destaque continua no mesmo pokémon.

---

## 🧠 O que dá para aprender com este projeto

- Buscar dados de uma API com `fetch` e tratar erros.
- Fazer vários pedidos ao mesmo tempo com `Promise.all`.
- Usar `async` e `await` para deixar o código assíncrono mais fácil de ler.
- Criar uma **classe** (`Pokemon`) para organizar os dados.
- Guardar resultados em um `Map` (cache) para não repetir pedidos.
- Reagir a cliques e ao teclado com `addEventListener`, incluindo a **delegação de eventos** na lista.
- Montar HTML com *template strings* e mostrar ou esconder partes da página.
- Fazer um visual caprichado só com CSS: gradientes, `grid`, animações, `color-mix()` e layout responsivo.

---

## 🛠️ Tecnologias usadas

| Tecnologia | Para que serve neste projeto |
|---|---|
| **HTML** | Estrutura do aparelho e da tela. |
| **CSS** | Todo o visual: carcaça, brilhos, tela, cartões, barras de status e animações. |
| **JavaScript** | A lógica: buscar dados, navegar, abrir detalhes, buscar e tocar os gritos. |
| **PokéAPI** | Fonte gratuita dos dados e das imagens dos pokémons. |

---

## ▶️ Como rodar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador, com duplo clique.

Se você usa o **VS Code**, também pode clicar em **Go Live** (extensão *Live Server*).

> 💡 **Importante:** a Pokédex precisa de **internet** para buscar os pokémons, as imagens e os gritos. Sem conexão, ela mostra uma mensagem de erro.

---

## 📁 Estrutura do projeto

```
├── index.html
├── README.md
└── assets
    ├── css
    │   ├── global.css
    │   └── pokedex.css
    └── js
        ├── pokemon-model.js
        ├── poke-api.js
        └── main.js
```

---

## 🚀 O que foi melhorado em relação ao original

**Mantido do original:** a mesma estrutura de arquivos, o uso da PokéAPI, a classe `Pokemon`, o limite de 151 pokémons e o botão de carregar mais.

**Corrigido:**
- Os arquivos de CSS e JavaScript eram ligados com `/assets/...`, o que fazia a página abrir **em branco** ao dar duplo clique no `index.html`. Agora os caminhos são relativos (`./assets/...`) e funcionam em qualquer lugar.
- Se a API falhar, aparece uma mensagem na tela, em vez de nada.

**Novo:**
- O visual de Pokédex de verdade, no lugar da tela branca.
- Tela de detalhes com status, medidas, habilidades e o grito.
- Navegação por direcional, botões A e B e teclado.
- Busca por nome ou número.
- Layout responsivo para celular.

---

## 🙌 Créditos

Este projeto é uma versão melhorada do **js-developer-pokedex**, proposto pela **[DIO](https://www.dio.me/)**, com base no repositório original.

Muito obrigado pela ideia e pela base do projeto! 👏

Os dados e as imagens dos pokémons vêm da **[PokéAPI](https://pokeapi.co/)**. Pokémon e seus personagens são marcas da Nintendo, da Game Freak e da Creatures. Este é um projeto de estudo, sem fins comerciais.

---

## 👨‍💻 Autor desta versão

Feito por **Vinícius Cruz dos Santos**

[![GitHub](https://img.shields.io/badge/GitHub-Viniciuscruzdossantos-181717?logo=github)](https://github.com/Viniciuscruzdossantos)
