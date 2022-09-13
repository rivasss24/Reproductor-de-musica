import Coments from "./models/coments.js";
import {
    guardarInLocalStorage,
    leerLocalStorage
} from "./helpers/localStorage.js";

const songList = [
    {
        cancion:'Si veo a tu mamá',
        artista: 'Bad Bunny',
        File: '1.mp3',
        cover: '1.jpg'
    },
    {
        cancion: 'Falling',
        artista: 'Harry Styles',
        File: '2.mp3',
        cover: '2.jpg'
    },
    {
        cancion: 'Monster',
        artista: 'Kanye West',
        File: '3.mp3',
        cover: '3.jpg'
    },
    {   
        cancion: 'IN THE CLUB',
        artista: 'Mishashi Sensei',
        File: '4.mp3',
        cover: '4.jpg'
    },
    {
        cancion: 'SMOKED OUT',
        artista: 'PRXSXNT FXTURE',
        File: '5.mp3',
        cover: '5.jpg'
    },
    {
        cancion: 'Life Goes On',
        artista: 'Oliver Tree ',
        File: '6.mp3',
        cover: '6.jpg'
    }
]

const audio = document.getElementById('audio');
const play = document.getElementById('play');
const repeat = document.getElementById('repeat');
const slider = document.getElementById('slider');
const tiempoActual = document.getElementById('tiempoActual');
const hamburgesa = document.getElementById('hamburgesa');
const fill = document.getElementById('fill');

const volumeIcon = document.getElementById('volumeIcon');
const volume = document.getElementById('volume');


const coments = new Coments;

const leerLS = leerLocalStorage();

if( leerLS ){
    coments.loadComentsFromArray( leerLS );
}

//------------------------------------------------------

play.onclick = ( event ) =>{
    if(audio.paused){
        playSong();
    } else {
        pauseSound();
    }
}

const actualizarControles = () =>{
    if(audio.paused){
        play.removeAttribute('class');
        play.setAttribute('class', 'fas fa-play');
    }
    if (!audio.paused){
        play.removeAttribute('class');
        play.setAttribute('class', 'fas fa-pause');
    }
}

const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artistName = document.getElementById('artistName');
const duracion = document.getElementById('duracion');

const actualizarDatos = () => {

    const soung  = songList[actualSong];

    console.log( soung );

    title.innerText = `${soung.cancion}`;
    artistName.innerText = `${soung.artista}`;
    cover.src = `./img/${ soung.cover }`;
}

const playSong = () => {
    audio.play();
    actualizarControles();
}

const pauseSound = () => {
    audio.pause() ;
    actualizarControles();
}

let sliderClicked = false;

const actualizarSegundos = ( event ) => {

    const minuteDuracion = Math.floor(( audio.duration / 60) % 60)
    .toString().padStart(2,"0");
    
    const secondDuracion = Math.floor( audio.duration % 60)
    .toString().padStart(2,"0");

    if( !sliderClicked ){

            const minute = Math.floor(( audio.currentTime / 60) % 60)
            .toString().padStart(2,"0");

            const second = Math.floor( audio.currentTime % 60)
            .toString().padStart(2,"0");
            
            tiempoActual.innerText = `${minute}:${second}`;
    }
    //Este if de abajo esta super remendado sorry ...
    if( `${minuteDuracion}`!== 'NaN' && `${secondDuracion}`!== 'NaN' ){
        duracion.innerText = `${minuteDuracion}:${secondDuracion}`
    }
}

const actualizarSegundosSlider = ( currentTime ) =>{

    const minute = Math.floor(( currentTime / 60) % 60)
    .toString().padStart(2,"0");
    
    const second = Math.floor( currentTime % 60)
    .toString().padStart(2,"0");

    if(`${minute}`!== 'NaN' && `${second}`!== 'NaN' ){
        tiempoActual.innerText = `${minute}:${second}`;
    }
}

const actualizarProgeso = ( event ) =>{
    const { duration, currentTime} = event.srcElement;
    const porcentaje = (currentTime/ duration) * 100;
    if(!sliderClicked){
        slider.value = porcentaje;
        fill.style.width = `${porcentaje}%`;
    }
    actualizarSegundos( event );
}

audio.addEventListener("timeupdate", actualizarProgeso );

/*
const updateTime = ( currentTime, duration ) => {
    tiempoActual.innerHTML = currentTime;
    duracion.innerHTML = duration;
}
*/

slider.onmousedown = () => {
    sliderClicked = true;
};

slider.onmouseup = () => {
    sliderClicked = false;
};


slider.oninput = () => {

    const currentTime = (audio.duration * event.target.value)/100;
    fill.style.width = `${event.target.value}%`;
    actualizarSegundosSlider(currentTime);
    
}

slider.onchange = ( event ) => {
    audio.currentTime = (audio.duration * event.target.value)/100;
}


const fillVolume = document.getElementById('fillVolume');

volume.oninput = (e) => {

    const volumeValue = (e.target.value)/100;
    audio.volume = volumeValue;
    fillVolume.style.width = `${e.target.value}%`

}

//mutear el sonido
volumeIcon.onclick = ( e ) => {
    if( audio.muted ){
        volumeIcon.removeAttribute('class');
        volumeIcon.setAttribute('class','fas fa-volume-up');
        audio.muted = !audio.muted
        return true
    } else if( !audio.muted ){
        volumeIcon.removeAttribute('class');
        volumeIcon.setAttribute('class','fas fa-volume-mute');
        audio.muted = !audio.muted
        return true
    }

}

//------------------------------------------------------

let actualSong = null

//------------------------------------------------------

const limpiarComents = () => {
    Array.from( hamburgesa.children )
    .forEach( ( element , i )=>{
        if( 1 < i ){
            hamburgesa.removeChild( element );
        }
    });
}

//------------------------------------------------------
    /*
    const editComent = ( event ) =>{
        event.target.parentNode.parentNode.id
    }
    */

    const deleteComent = ( event ) => {
        const id = event.target.parentNode.parentNode.id;
        coments.borrar( id );
        guardarInLocalStorage( coments.ComentsArray );
        renderComents();
    }

//------------------------------------------------------
const renderComents = () => {

    limpiarComents();

    const comentsArray = coments.ComentsArray.filter( ( coment )=>{
        return coment.File === actualSong;
    }).reverse();

    
    comentsArray.forEach( ({ id, File, user, coment }) => {

        const div = document.createElement('div');
        div.classList.add('coment-container');
        div.innerHTML = `
        <img src="./img/mr_robot.gif" alt="" class="input-coment-image">
        <div class="coment">
          <h2>${ user }</h2>
          <p>${ coment }</p>
        </div>
        `;

        //crear botones delete an editar
        const divEllipsis = document.createElement('div');

        divEllipsis.classList = "ellipsis";
        divEllipsis.setAttribute("id", `${id}`);
        divEllipsis.setAttribute("name", "ellipsis");
        divEllipsis.setAttribute("tabindex","0");
        divEllipsis.innerHTML = `
        <i class="fas fa-ellipsis-v"></i>
          <div class="edit-delete-coment-container" id="editDeleteComentContainer" style="display: none ;">  
            ${
                ''
                /*
            <p class="edit-coment" id="editComent">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </i>
                Editar
            </p>
                */
            }
            <p class="delete-coment" id="deleteComent">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </i>
                Eliminar
            </p>
          </div>
        `

        divEllipsis.onclick = ( event ) => {
            //al hacer click en el mismo lugar se sale
          /*if(document.activeElement.id === event.target.parentNode.id ){
            divEllipsis.children[1].style.display = "none";
            return true;
            }*/
            divEllipsis.focus();
            divEllipsis.children[1].style.display = "flex";
        }

        divEllipsis.onblur = () => {
            console.log('clicked fuera');
            divEllipsis.children[1].style.display = "none";
        }

        //divEllipsis.children[1].children[0].onclick = (e) => editComent(e);
        divEllipsis.children[1].children[0].onclick = (e) => deleteComent(e);

        div.appendChild(divEllipsis);

        hamburgesa.appendChild(div);

    });
    
}

//------------------------------------------------------

// Cargar canciones y mostrar el listado

const playListContainer = document.getElementById('playListContainer');

const loadSongs = () => {
    songList.forEach( (song, i) => {
        // Crear div
        const div = document.createElement("div");
        div.classList.add("sound");
        div.innerHTML = `
        <img src="./img/${ i+1 }.jpg" alt="">
        <div class="sound-info">
          <h4>${song.cancion}</h4>
          <p>${song.artista}</p>
        </div>
        `
        // Escuchar clicks 
        div.onclick = () => {
            loadSong( i );
        }

        playListContainer.appendChild(div);
    });
}

loadSongs();

//------------------------------------------------------


// Cargar canción seleccionada

const loadSong =  ( indice ) =>{

    console.log('indice', indice );

    const soung = songList[ indice ];

    if ( indice !== actualSong) {
        //change active class cambia la clase en las lista de la cancion que se,
        //esta reproduciendo
        //changeActiveClass( actualSong, songIndex)
        actualSong = indice;
        //audio.src = "./audio/" + songList[songIndex].file
        audio.src = `./bucket/${indice + 1}.mp3`
        actualizarDatos();
        playSong();
        //changeSongtitle(songIndex)
        //changeCover(songIndex)
        
    }
}

//------------------------------------------------------

let randomMode = false;

const randomButton = document.getElementById('randomButton');
const random = document.getElementById('random');

random.onclick = () =>{
    randomMode = !randomMode;
    if(randomMode){
        randomButton.classList.remove('random-button-inactive');
        randomButton.classList.add('random-button-active');
    } else {
        if(!randomMode){
            randomButton.classList.remove('random-button-active');
            randomButton.classList.add('random-button-inactive');
        }
    }
    console.log('Random mode active');
}

const getSongRandom  = () =>{

    const totalSong = songList.length - 1;

    const random = () => {
        return Math.floor((Math.random() * ( totalSong - 0 + 1)) + 0 );
    }

    return random();
}

//------------------------------------------------------

const next = document.getElementById('next');
const prev = document.getElementById('prev');

const prevSong = () => {
    
    if(randomMode){
        loadSong(getSongRandom());
    } else{
        if (actualSong > 0) {
            loadSong(actualSong - 1)
        } else {
            loadSong(songList.length - 1)
        }
    }

}

const nextSong = () => {
    if(randomMode){
        const soungRandom = getSongRandom(); 
        console.log('siguiente cancion:',soungRandom);
        loadSong( soungRandom );
    }else{
        if ( actualSong < songList.length - 1) {
            loadSong(actualSong + 1)
        } else {
            loadSong( 0 )
        }
    }
}

prev.onclick = () => {
    prevSong();
}

next.onclick = () => {

    nextSong();
}

//------------------------------------------------------

let repeatOnce = false

const repeatButton = document.getElementById('repeatButton');

repeat.onclick = () => {
    //validar que las canciones esten cargadas
    if( !!actualSong || actualSong === 0 ){
        if( !repeatOnce && !audio.loop ){
            repeatOnce = 1;
            console.log('repetir una vez')
            updateIconRepeat('repeat');
            return true
        }
        if( repeatOnce && !audio.loop ){
            repeatOnce = false;
            audio.loop = true;
            console.log('repetir muchas veces');
            updateIconRepeat('loop');
            return true
        }
        if( !repeatOnce && audio.loop ){
            audio.loop = false;
            console.log('no se repetiran');
            updateIconRepeat('norepeat');
            return true
        }
    }
}

const updateIconRepeat = ( obtion ) => {
    if( obtion === 'repeat' ){
        repeatButton.classList.remove('repeat-button-inactive');
        repeatButton.classList.add('repeat-button-active-one');
        return true
    }
    if( obtion === 'loop' ){
        repeatButton.classList.remove('repeat-button-active-one');
        repeatButton.classList.add('repeat-button-active');
        return true
    }
    if( obtion === 'norepeat' ){
        repeatButton.classList.remove('repeat-button-active');
        repeatButton.classList.add('repeat-button-inactive');
        return true
    }
}
//------------------------------------------------------

//cuando termine el audio
audio.addEventListener("ended", () => {
    
    play.removeAttribute('class');
    play.setAttribute('class', 'fas fa-play');

    if( repeatOnce ){
        // repetir cancion
        if( repeatOnce === 1 ){
            repeatOnce = repeatOnce + 1; 
            playSong();
            console.log('primervuelta');
            return true
        }
        else if( repeatOnce === 2 ){
            repeatOnce = repeatOnce - 1;
            nextSong();
            console.log('segundavuelta');
            return true
        }

    }

    if( audio.lopp === true ){
        //no hacer nada supongo u.u
        //solo retornar true para que no se ejecute la funcion nexSong;
        return true;
    }
    nextSong();
});

//------------------------------------------------------

const comentIcon = document.getElementById('comentIcon');
const buttonsContet = document.getElementById('buttonsContet');
const comentInput = document.getElementById('comentInput');
const closeComents = document.getElementById('closeComents');
const cancelar = document.getElementById('cancelar');
const comentar = document.getElementById('comentar');

comentIcon.onclick = () => {
    if( !!actualSong !== false || actualSong === 0 ){
        renderComents();
        hamburgesa.style.display = "block";
    }
}

comentInput.onfocus = () => {
    buttonsContet.style.display = 'flex';
}

comentInput.onkeyup = ( e ) => {

    const value = e.target.value;
    console.log(value)
    if( value ){
        comentar.classList.remove('comentar-inactive');
        comentar.classList.add('comentar-active');
    } else if( !value || value === '' ) {
        comentar.classList.remove('comentar-active');
        comentar.classList.add('comentar-inactive');
    }
    
}

const resetComentInput = () => {
    buttonsContet.style.display = 'none';
    comentInput.value = '';
    comentar.classList.remove('comentar-active');
    comentar.classList.add('comentar-inactive');

}

cancelar.onclick = () => resetComentInput();


closeComents.onclick = () => {
    console.log('Cerrar Hamburgesa');
    hamburgesa.style.display = "none";
    resetComentInput();
}


comentar.onclick = () => {
    const coment = comentInput.value;
    coments.guardarComent( coment, actualSong );
    //reseteamos los valores del input
    comentInput.value = ''
    comentar.classList.remove('comentar-active');
    comentar.classList.add('comentar-inactive');
    guardarInLocalStorage( coments.ComentsArray );
    renderComents();
}


//------------------------------------------------------

const listIcon = document.getElementById('listIcon');
const playList = document.getElementById('playList');
const listIconClose = document.getElementById('listIconClose');

listIcon.onclick = () => {
    playList.style.display = 'flex';
}

listIconClose.onclick = () => {
    playList.style.display = 'none';    
}