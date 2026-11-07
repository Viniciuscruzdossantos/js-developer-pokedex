
const pokeApi = {}

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon'

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const outros = pokeDetail.sprites.other || {}
    pokemon.photo = (outros['official-artwork'] && outros['official-artwork'].front_default)
        || (outros.dream_world && outros.dream_world.front_default)
        || pokeDetail.sprites.front_default
    pokemon.icon = pokeDetail.sprites.front_default || pokemon.photo

    pokemon.height = pokeDetail.height / 10
    pokemon.weight = pokeDetail.weight / 10
    pokemon.stats = pokeDetail.stats.map((s) => ({ nome: s.stat.name, valor: s.base_stat }))
    pokemon.abilities = pokeDetail.abilities.map((a) => a.ability.name)
    pokemon.cry = pokeDetail.cries ? (pokeDetail.cries.latest || pokeDetail.cries.legacy || null) : null

    return pokemon
}

function lerJson(response) {
    if (!response.ok) throw new Error(`Erro ${response.status} ao consultar a PokéAPI`)
    return response.json()
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then(lerJson)
        .then(convertPokeApiDetailToPokemon)
}

// Busca um pokémon específico pelo número ou pelo nome
pokeApi.getPokemonByKey = (key) => {
    return fetch(`${POKE_API_URL}/${key}`)
        .then(lerJson)
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `${POKE_API_URL}?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then(lerJson)
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
