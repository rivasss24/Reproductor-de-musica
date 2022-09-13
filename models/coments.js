import Coment from './coment.js';

export default class Coments{

    _coments = {};

    get ComentsArray(){
    const coments = [];
        
    Object.keys(this._coments).forEach( key =>{

        const coment = this._coments[ key ];
        
        coments.push( coment );
    });

    return coments;
    }

    constructor(){
        this._coments = {};
    }


    borrar(id = ""){
        console.log( id );
        if(this._coments[id]){
            delete this._coments[id];
        }

        console.log( this._coments );
    }
    
    loadComentsFromArray( coments = [] ){
        coments.forEach( coment => {
            this._coments[coment.id] = coment;
        });
    }
    /*
    editarComent( id, producto ){
        //lo ideal seria no colocar la id que nos a pasado el usuario pero por los,
        //momentos lo dejare asi 
        this._registros[id] = { id, ...producto };

        return this._registros[id];
    }
    */

    guardarComent( comentario , id ){
        console.log( 'desde el model:', comentario );
        const File = id;
        const user = 'rivasss24';
        const coment = new Coment( File, comentario, user );
        this._coments[ coment.id ] =  coment ;

        console.log( this._coments );
        //return registro;
    }

}