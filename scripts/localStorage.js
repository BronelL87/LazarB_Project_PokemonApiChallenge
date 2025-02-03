const savePokemon = (userPoke) => {
    let userFavs = getFavPokes();

    if(!userFavs.includes(userPoke)){
        userFavs.push(userPoke)
    }

    localStorage.setItem('Pokemon', JSON.stringify*(userFavs));
}

const getFavPokes = () => {
    let storageData = localStorage.getItem('Pokemon');

    if(storageData == null){
        return [];
    }
    return JSON.parse(storageData);
}

const removefavPoke = (userPoke) => {
    let storageData = getFavPokes();

    let pokeI = storageData.indexOf(userPoke)

    storageData.splice(pokeI, 1);

    localStorage.setItem('Pokemon', JSON.stringify(storageData));
}

export {savePokemon, getFavPokes, removefavPoke }