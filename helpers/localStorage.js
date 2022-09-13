
const guardarInLocalStorage = (data) => {
    const coments = JSON.stringify(data);
    localStorage.setItem( 'coments', coments );
}


const leerLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('coments'));
    if( !data ){
        return null;
    }
    return data;
}

export {
    guardarInLocalStorage,
    leerLocalStorage
}