const pokedex = document.getElementById('pokedex')
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const detalhe = document.getElementById('detalhe')
const mensagem = document.getElementById('mensagem')
const lcdTitulo = document.getElementById('lcdTitulo')
const lcdInfo = document.getElementById('lcdInfo')
const buscaForm = document.getElementById('busca')
const buscaInput = document.getElementById('buscaInput')
const buscaErro = document.getElementById('buscaErro')

const maxRecords = 151
const limit = 12
let offset = 0

const estado = {
    lista: [],          // pokémons carregados na lista, em ordem
    cache: new Map(),   // todos os que já foram buscados (por número e por nome)
    selecionado: -1,    // posição do pokémon destacado na lista
    emDetalhe: false,   // true quando a tela de detalhes está aberta
    atual: null,        // pokémon aberto nos detalhes
    carregando: false,
}

const TIPOS = {
    normal: 'normal', fire: 'fogo', water: 'água', electric: 'elétrico', grass: 'planta',
    ice: 'gelo', fighting: 'lutador', poison: 'veneno', ground: 'terrestre', flying: 'voador',
    psychic: 'psíquico', bug: 'inseto', rock: 'pedra', ghost: 'fantasma', dragon: 'dragão',
    dark: 'sombrio', steel: 'aço', fairy: 'fada',
}

const STATS = {
    hp: 'HP', attack: 'Ataque', defense: 'Defesa',
    'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Veloc.',
}

const pad = (n) => String(n).padStart(3, '0')
const nomeBonito = (nome) => nome.replace(/-/g, ' ')
const formatar = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/* ---------- lista ---------- */

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" role="button"
            aria-label="${nomeBonito(pokemon.name)}, número ${pokemon.number}">
            <span class="number">#${pad(pokemon.number)}</span>
            <img src="${pokemon.icon}" alt="" loading="lazy">
            <span class="name">${nomeBonito(pokemon.name)}</span>
        </li>
    `
}

function guardarNoCache(pokemon) {
    estado.cache.set(pokemon.number, pokemon)
    estado.cache.set(pokemon.name, pokemon)
}

function setCarregando(valor) {
    estado.carregando = valor
    pokedex.classList.toggle('carregando', valor)
    loadMoreButton.disabled = valor
}

function mostrarMensagem(texto) {
    mensagem.textContent = texto
    mensagem.hidden = false
}

// Devolve uma promessa que termina com true (deu certo) ou false (deu erro)
function loadPokemonItens(offset, limit) {
    setCarregando(true)

    return pokeApi.getPokemons(offset, limit)
        .then((pokemons = []) => {
            pokemons.forEach(guardarNoCache)
            estado.lista.push(...pokemons)
            pokemonList.insertAdjacentHTML('beforeend', pokemons.map(convertPokemonToLi).join(''))
            mensagem.hidden = true

            if (estado.selecionado < 0 && estado.lista.length > 0) selecionar(0, false)
            atualizarLcd()
            return true
        })
        .catch((erro) => {
            console.error('Erro ao carregar os pokémons:', erro)
            if (estado.lista.length === 0) {
                mostrarMensagem('Sem sinal! Não foi possível carregar os pokémons. Verifique sua conexão com a internet.')
            } else {
                lcdInfo.textContent = 'ERRO DE CONEXAO'
            }
            return false
        })
        .finally(() => setCarregando(false))
}

/* ---------- seleção e navegação ---------- */

function selecionar(indice, rolar = true) {
    if (indice < 0 || indice >= estado.lista.length) return

    const itens = pokemonList.children
    if (itens[estado.selecionado]) itens[estado.selecionado].classList.remove('selecionado')

    estado.selecionado = indice
    itens[indice].classList.add('selecionado')
    if (rolar) itens[indice].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    atualizarLcd()
}

function colunas() {
    return getComputedStyle(pokemonList).gridTemplateColumns.split(' ').length
}

function mover(direcao) {
    if (estado.emDetalhe) {
        // nos detalhes, o direcional troca de pokémon
        if (direcao === 'esquerda' || direcao === 'cima') irParaVizinho(-1)
        if (direcao === 'direita' || direcao === 'baixo') irParaVizinho(1)
        return
    }

    const passos = { esquerda: -1, direita: 1, cima: -colunas(), baixo: colunas() }
    const alvo = estado.selecionado + passos[direcao]
    selecionar(Math.max(0, Math.min(estado.lista.length - 1, alvo)))
}

/* ---------- detalhes ---------- */

async function obterPokemon(chave) {
    if (estado.cache.has(chave)) return estado.cache.get(chave)

    try {
        const pokemon = await pokeApi.getPokemonByKey(chave)
        if (pokemon.number > maxRecords) return null // só a primeira geração (Kanto)
        guardarNoCache(pokemon)
        return pokemon
    } catch (erro) {
        console.error('Erro ao buscar o pokémon:', erro)
        return null
    }
}

async function irParaVizinho(passo) {
    const numero = estado.atual.number + passo
    if (numero < 1 || numero > maxRecords) return

    setCarregando(true)
    const pokemon = await obterPokemon(numero)
    setCarregando(false)

    if (pokemon && estado.emDetalhe) abrirDetalhe(pokemon)
}

function renderDetalhe(p) {
    const tipos = p.types.map((t) => `<li class="tipo ${t}">${TIPOS[t] || t}</li>`).join('')
    const habilidades = p.abilities.map(nomeBonito).join(', ')
    const stats = p.stats.map((s) => `
        <li class="stat">
            <span class="stat__nome">${STATS[s.nome] || s.nome}</span>
            <span class="stat__valor">${s.valor}</span>
            <span class="stat__barra"><i style="--v:${s.valor}"></i></span>
        </li>`).join('')

    return `
        <header class="detalhe__topo">
            <span class="detalhe__numero">#${pad(p.number)}</span>
            <h2 class="detalhe__nome">${nomeBonito(p.name)}</h2>
        </header>

        <div class="detalhe__esq">
            <div class="palco"><img src="${p.photo}" alt="${nomeBonito(p.name)}"></div>
            ${p.cry ? '<button type="button" class="grito" data-grito>Ouvir grito</button>' : ''}
        </div>

        <div class="detalhe__dir">
            <ul class="tipos">${tipos}</ul>
            <dl class="medidas">
                <div><dt>Altura</dt><dd>${formatar(p.height)} m</dd></div>
                <div><dt>Peso</dt><dd>${formatar(p.weight)} kg</dd></div>
            </dl>
            <p class="habilidades"><strong>Habilidades:</strong> ${habilidades}</p>
            <ul class="stats">${stats}</ul>
        </div>
    `
}

function abrirDetalhe(pokemon) {
    estado.emDetalhe = true
    estado.atual = pokemon

    const posicao = estado.lista.findIndex((p) => p.number === pokemon.number)
    if (posicao >= 0) selecionar(posicao, false)

    detalhe.className = `detalhe ${pokemon.type}`
    detalhe.innerHTML = renderDetalhe(pokemon)
    detalhe.hidden = false
    pokemonList.hidden = true
    detalhe.scrollTop = 0
    atualizarLcd()
}

function fecharDetalhe() {
    if (!estado.emDetalhe) return

    estado.emDetalhe = false
    detalhe.hidden = true
    pokemonList.hidden = false

    const itens = pokemonList.children
    if (itens[estado.selecionado]) itens[estado.selecionado].scrollIntoView({ block: 'center' })
    atualizarLcd()
}

function tocarGrito() {
    if (!estado.atual || !estado.atual.cry) return
    const audio = new Audio(estado.atual.cry)
    audio.volume = 0.5
    audio.play().catch(() => { /* o navegador pode bloquear o som: tudo bem */ })
}

function botaoA() {
    if (estado.emDetalhe) return tocarGrito()
    if (estado.lista[estado.selecionado]) abrirDetalhe(estado.lista[estado.selecionado])
}

/* ---------- visor verde (LCD) ---------- */

function atualizarLcd() {
    const pokemon = estado.emDetalhe ? estado.atual : estado.lista[estado.selecionado]
    lcdTitulo.textContent = pokemon ? `#${pad(pokemon.number)} ${nomeBonito(pokemon.name)}` : 'POKÉDEX'
    lcdInfo.textContent = estado.emDetalhe
        ? 'A: GRITO  B: VOLTAR'
        : `A: ABRIR  ${estado.lista.length}/${maxRecords}`
}

/* ---------- busca ---------- */

function mostrarErroBusca(texto) {
    buscaErro.textContent = texto
}

buscaForm.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const termo = buscaInput.value.trim().toLowerCase().replace(/^#/, '')
    if (!termo) return

    const chave = /^\d+$/.test(termo) ? Number(termo) : termo
    if (typeof chave === 'number' && (chave < 1 || chave > maxRecords)) {
        mostrarErroBusca('Digite um número de 1 a 151.')
        return
    }

    setCarregando(true)
    const pokemon = await obterPokemon(chave)
    setCarregando(false)

    if (!pokemon) {
        mostrarErroBusca('Não encontrei esse pokémon em Kanto (1 a 151).')
        return
    }

    mostrarErroBusca('')
    abrirDetalhe(pokemon)
    buscaInput.blur()
})

/* ---------- controles ---------- */

pokemonList.addEventListener('click', (evento) => {
    const li = evento.target.closest('.pokemon')
    if (!li) return

    const indice = Array.prototype.indexOf.call(pokemonList.children, li)
    selecionar(indice, false)
    abrirDetalhe(estado.lista[indice])
})

detalhe.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-grito]')) tocarGrito()
})

document.querySelectorAll('[data-dir]').forEach((botao) => {
    botao.addEventListener('click', () => mover(botao.dataset.dir))
})

document.querySelector('[data-acao="a"]').addEventListener('click', botaoA)
document.querySelector('[data-acao="b"]').addEventListener('click', fecharDetalhe)

document.addEventListener('keydown', (evento) => {
    if (evento.target.tagName === 'INPUT') return

    const direcoes = { ArrowUp: 'cima', ArrowDown: 'baixo', ArrowLeft: 'esquerda', ArrowRight: 'direita' }

    if (direcoes[evento.key]) {
        evento.preventDefault()
        mover(direcoes[evento.key])
    } else if ((evento.key === 'Enter' || evento.key === ' ') && !evento.target.closest('button')) {
        evento.preventDefault()
        botaoA()
    } else if (evento.key === 'Escape' || evento.key === 'Backspace') {
        fecharDetalhe()
    }
})

loadMoreButton.addEventListener('click', () => {
    if (estado.carregando) return

    const proximoOffset = offset + limit
    const novoLimite = Math.min(limit, maxRecords - proximoOffset)

    loadPokemonItens(proximoOffset, novoLimite).then((deuCerto) => {
        if (!deuCerto) return
        offset = proximoOffset
        if (offset + limit >= maxRecords) loadMoreButton.hidden = true
    })
})

loadPokemonItens(offset, limit)
