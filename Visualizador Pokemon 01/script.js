"use strict";

// hemos limitidado a 151 elementos ya que somos milenial y queremos nostalgia.
const pokemonAPIURL = new URL("https://pokeapi.co/api/v2/pokemon?limit=151");
let listaPokemon = [];
const form = document.querySelector("form.buscador");
const searchInput = document.querySelector("input[type='search']");
const suggestions = document.querySelector(".suggestions");
const buscarBtn = document.getElementById("buscarBtn");
const informacionPokemon = document.querySelector(".informacionPokemon");

// Función para obtener la lista completa de Pokémon y guardarla
async function buscadorTOTAL() {
  try {
    const response = await fetch(pokemonAPIURL);

    if (!response.ok) {
      throw new Error("La web no responde");
    }

    const data = await response.json();
    listaPokemon = data.results; // Guardamos la lista de Pokémon
    console.log(listaPokemon);
  } catch (error) {
    console.error("No se ha podido accerder a los datos ", error);
  }
}

// Llamamos a la función para obtener la lista de Pokémon
buscadorTOTAL();

// Función para filtrar Pokémon por nombre de Pokemon

function buscarPorNombre(name) {
  return listaPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Función para mostrar sugerencias al usar el buscador

function mostrarSugerencias() {
  const query = searchInput.value;

  // Si el campo de búsqueda está vacío, limpiar sugerencias y salir

  if (query === "") {
    suggestions.innerHTML = "";
    return;
  }
  const resultados = buscarPorNombre(query);

  // Limpiar sugerencias anteriores
  suggestions.innerHTML = "";

  // Mostrar nuevas sugerencias
  resultados.forEach((pokemon) => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;

    li.addEventListener("click", () => {
      searchInput.value = pokemon.name;
      mostrarInformacionPokemon(pokemon.name);
      suggestions.innerHTML = ""; // Limpiar sugerencias
    });
    suggestions.appendChild(li);
  });

  if (resultados.length === 0) {
    suggestions.innerHTML = "<li>No es un nombre valido</li>";
  }
}

// Función para obtener y mostrar la información de un Pokémon (segundo fetch)

async function mostrarInformacionPokemon(nombre) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la información del Pokémon");
    }
    // imprimir datos en el html

    const data = await response.json();

    informacionPokemon.innerHTML = `
    
    <div class="topCard">
    <div>
    <h2>${data.name.toUpperCase()}</h2>
    </div>
    <div>
    <p id="pEs">Tipo: ${data.types
      .map((typeInfo) => typeInfo.type.name)
      .join(" , ")}</p>
    </div>
    
    </div>
      <div class="imagenes">
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <img src="${data.sprites.back_default}" alt="${data.name}">
      </div>
      <div class="ptarjeta">
      <p>Ataque: ${
        data.stats.find((stat) => stat.stat.name === "attack").base_stat
      }</p>
      <p>Defensa: ${
        data.stats.find((stat) => stat.stat.name === "defense").base_stat
      }</p>
      <p>Vida: ${
        data.stats.find((stat) => stat.stat.name === "hp").base_stat
      }</p>
      <p>Velocidad: ${
        data.stats.find((stat) => stat.stat.name === "speed").base_stat
      }</p>
      <p>Altura: ${data.height / 10} m</p>
      <p>Peso: ${data.weight / 10} kg</p>
            </div>
        
        `;
    suggestions.innerHTML = "";
  } catch (error) {
    informacionPokemon.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Función para manejar la búsqueda ( ejemplo si esscribo pika y solo hay una opcion elije esa opcion)
function manejarBusqueda() {
  const nombre = searchInput.value.trim();
  const resultados = buscarPorNombre(nombre);

  if (resultados.length === 1) {
    mostrarInformacionPokemon(resultados[0].name);
  } else if (nombre) {
    mostrarInformacionPokemon(nombre);
  }
}
// Limpiar sugerencias después de manejar la búsqueda
suggestions.innerHTML = "";

// Añadir listener al formulario para capturar el evento de envío

form.addEventListener("submit", (event) => {
  event.preventDefault();
  manejarBusqueda();
});

// Añadir listener al input de búsqueda
searchInput.addEventListener("input", mostrarSugerencias);

// Añadir listener al botón de búsqueda
buscarBtn.addEventListener("click", manejarBusqueda);
