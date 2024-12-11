const endpoint = 'https://pokeapi.co/api/v2/pokemon/';
let pokemonDetails = [];  

async function fetchPokemonData() {
  try {
    const response = await axios.get(endpoint, { params: { limit: 20 } });
    
    const pokemonList = response.data.results;
    
    const pokemonDetailsPromises = pokemonList.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      const { name, sprites, id } = pokemonResponse.data;
      return { name, image: sprites.front_default, id };
    });

    pokemonDetails = await Promise.all(pokemonDetailsPromises);
    
    displayPokemonCards([]);  
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPokemonCards(pokemons) {
  const container = document.getElementById('pokemon-container');
  container.innerHTML = '';  
  if (pokemons.length === 0) {
    return;
  }

  pokemons.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    
    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = pokemon.name;
    
    const pokemonName = document.createElement('h3');
    pokemonName.textContent = pokemon.name;
    
    card.appendChild(pokemonImage);
    card.appendChild(pokemonName);
    
    container.appendChild(card);
  });
}

function filterPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  
  if (!searchInput) {
    displayPokemonCards([]);
    return;
  }
  
  const filteredPokemons = pokemonDetails.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(searchInput) || pokemon.id.toString().includes(searchInput);
  });

  displayPokemonCards(filteredPokemons);
}

fetchPokemonData();