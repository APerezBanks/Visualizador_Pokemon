"use strict";

const pokemonAPIURL = new URL("https://pokeapi.co/api/v2/pokemon?limit=1126");
let listaPokemon = [];
const form = document.querySelector("form.buscador");
const searchInput = document.querySelector("input[type='search']");
const suggestions = document.querySelector(".suggestions");
const buscarBtn = document.getElementById("buscarBtn");
const informacionPokemon = document.querySelector(".informacionPokemon");

// Escuchar el evento "keydown" para la tecla "Enter"
searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Previene la recarga de la página
    suggestions.innerHTML = ""; // Limpia las sugerencias al hacer la búsqueda
    buscadorPokemon();
  }
});

// Escuchar el evento "click" para cerrar sugerencias al hacer clic fuera
document.addEventListener("click", function(event) {
  if (!suggestions.contains(event.target) && event.target !== searchInput) {
    suggestions.innerHTML = "";
  }
});

// Función para obtener la lista completa de Pokémon
async function buscadorTOTAL() {
  try {
    const response = await fetch(pokemonAPIURL);
    if (!response.ok) {
      throw new Error("La web no responde");
    }
    const data = await response.json();
    listaPokemon = data.results; // Guardamos la lista de Pokémon
  } catch (error) {
    console.error("No has podido fetchear", error);
  }
}

// Llamamos a la función para obtener la lista de Pokémon
buscadorTOTAL();

// Función para filtrar Pokémon por nombre
function buscarPorNombre(name) {
  return listaPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Función para mostrar sugerencias
function mostrarSugerencias() {
  const query = searchInput.value;
  if (query.length === 0) {
    suggestions.innerHTML = "";
    return;
  }
  const resultados = buscarPorNombre(query);

  // Limpiar sugerencias anteriores
  suggestions.innerHTML = "";

  // Mostrar nuevas sugerencias
  resultados.slice(0, 3).forEach((pokemon) => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;
    li.addEventListener("click", () => {
      searchInput.value = pokemon.name;
      mostrarInformacionPokemon(pokemon.name);
      suggestions.innerHTML = ""; // Limpiar sugerencias
    });
    suggestions.appendChild(li);
  });
}

// Escuchar el evento "input" para mostrar sugerencias mientras se escribe
searchInput.addEventListener("input", mostrarSugerencias);

// Función para buscar información de un Pokémon
async function buscadorPokemon() {
  const valorBusqueda = searchInput.value.toLowerCase();
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${valorBusqueda}`);
    if (!response.ok) {
      throw new Error("Pokemon no encontrado");
    }
    const pokemonData = await response.json();
    mostrarInformacionPokemon(pokemonData);
  } catch (error) {
    console.error(error);
    informacionPokemon.innerHTML = `<p>${error.message}</p>`;
  }
}

// Función para mostrar información del Pokémon
function mostrarInformacionPokemon(pokemonName) {
  const pokemon = listaPokemon.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
  if (pokemon) {
    fetch(pokemon.url)
      .then(response => response.json())
      .then(data => {
        informacionPokemon.innerHTML = `
          <img src="${data.sprites.front_default}" alt="${data.name} frontal">
          <div>
            <h2>${data.name}</h2>
            <p>Altura: ${data.height}</p>
            <p>Peso: ${data.weight}</p>
            <p>Puntos de vida: ${data.stats[0].base_stat}</p>
            <p>Ataque: ${data.stats[1].base_stat}</p>
            <p>Defensa: ${data.stats[2].base_stat}</p>
            <p>Velocidad: ${data.stats[5].base_stat}</p>
            <p>Tipos: ${data.types.map((typeInfo) => typeInfo.type.name).join(", ")}</p>
          </div>
        `;
      })
      .catch(error => {
        console.error(error);
        informacionPokemon.innerHTML = `<p>Error al obtener información del Pokémon</p>`;
      });
  } else {
    informacionPokemon.innerHTML = `<p>Pokemon no encontrado en la lista</p>`;
  }
}
