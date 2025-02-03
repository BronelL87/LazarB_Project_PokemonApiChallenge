import { savePokemon, getFavPokes, removefavPoke } from "./localStorage.js";

const pokeName = document.getElementById("pokeName");
const pokeId = document.getElementById("pokeId");
const pokeType = document.getElementById("pokeType");
const pokeLocation = document.getElementById("pokeLocation");
const pokeAbility = document.getElementById("pokeAbility");
const pokeMoves = document.getElementById("pokeMoves");
const pokeEvol = document.getElementById("pokeEvol");
const pokeSearch = document.getElementById("pokeSearch");
const searchBtn = document.getElementById("searchBtn");
const pokeImg = document.getElementById("pokeImg");
const shinyBtn = document.getElementById("shinyBtn");
const randomBtn = document.getElementById("randomBtn");
const addFav = document.getElementById("addFav");
const displayFavs = document.getElementById("displayFavs");
const favsBtn = document.getElementById("favsBtn");

let isShiny = false;
let currentPoke;

const getPokemon = async (userSearch) => {


    const evolResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${userSearch}`);

    const evolData = await evolResponse.json();
    const evolId = evolData.id;

    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolId}`);
    const data = await promise.json();


    if (data.id < 1 || data.id > 649) {
        let errorMessage = "Only Pokemon from Generation 1 to 5 are allowed.";
        pokeImg.src = './assets/notFoundI.png';
        pokeName.innerText = errorMessage;
        pokeType.innerText = "";
        pokeId.innerText = "";
        pokeLocation.innerText = "";
        pokeAbility.innerText = "";
        pokeMoves.innerText = "";
        pokeEvol.innerText = "";
        return;
    }


    pokeName.innerText = data.name;
    pokeId.innerText = `#${data.id}`;
    let typeArr = data.types.map((typing) => typing.type.name);
    pokeType.innerText = typeArr.join(' | ')

    let abilityArr = data.abilities.map((pokeAbility) => pokeAbility.ability.name);
    pokeAbility.innerText = abilityArr.join(' | ');

    let movesArr = data.moves.map((pokeMoves) => pokeMoves.move.name);
    pokeMoves.innerText = movesArr.join(' | ');

    pokeImg.src = data.sprites.front_default;

    console.log(typeArr)

    currentPoke = data;
    isShiny = false;
    const locationResponse = await fetch(data.location_area_encounters);
    const locationData = await locationResponse.json();

    if (locationData.length > 0) {
        pokeLocation.innerText = `${locationData[0].location_area.name}`;
    } else {
        pokeLocation.innerText = "N/A";
    }

    getEvolutions(userSearch);

    return data;
}



const getEvolutions = async (pokemon) => {

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);


    const speciesData = await speciesResponse.json();
    const evolResponse = await fetch(speciesData.evolution_chain.url);

    const evolData = await evolResponse.json();
    let evolutionNames = [];
    let filteredEvolutions = []; 

 
    const pullEvolutions = (evo) => {
        evolutionNames.push(evo.species.name);
        evo.evolves_to.forEach(nextEvo => pullEvolutions(nextEvo));
    };

    pullEvolutions(evolData.chain);

    
    for (let i = 0; i < evolutionNames.length; i++) {
        const name = evolutionNames[i];
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const speciesInfo = await speciesRes.json();

        if (speciesInfo.id >= 1 && speciesInfo.id <= 649) {
            filteredEvolutions.push(name);
        }
    }

    if (filteredEvolutions.length > 1) {
        pokeEvol.innerText = filteredEvolutions.join(" | ");
    } else {
        pokeEvol.innerText = "N/A";
    }
};


getPokemon("bulbasaur");

searchBtn.addEventListener('click', () => {
    getPokemon(pokeSearch.value.toLowerCase().trim())
});

randomBtn.addEventListener("click", () => {
    const randomId = Math.floor(Math.random() * 650);
    getPokemon(randomId);
});


shinyBtn.addEventListener('click', () => {
    if (currentPoke) {
        isShiny = !isShiny;
        pokeImg.src = isShiny ? currentPoke.sprites.front_shiny : currentPoke.sprites.front_default;
    }
});


const showFavorite = async () =>{
    const favoritePoke = getFavPokes();

    displayFavs.innerText = "";
    favoritePoke.map(userPoke => {
        let p = document.createElement('p');

        p.className = "mt-[10px]";
        p.innerText = userPoke;

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'ml-[10px] cursor-pointer';
        deleteBtn.textContent = 'X';

        deleteBtn.addEventListener('click', () => {
            removefavPoke(userPoke);
            p.remove();
        });

        p.appendChild(deleteBtn);

        displayFavs.appendChild(p);
    })
}
let userSearch = "bulbasaur";
userSearch = pokeSearch.value;
addFav.addEventListener('click', async () => {
    const userPoke = await getPokemon(userSearch);
    savePokemon(userPoke.name);

});

favsBtn.addEventListener('click', () => {
    showFavorite();
})

console.log(getPokemon());