import uuid from '../helpers/uuid.js';

export default class Coment{
    id        = '';
    File    = '';
    coment   = '';
    user    = '';

    constructor( File, coment, user ){
        this.id = uuid();
        this.File = File;
        this.coment = coment;
        this.user = user;
    }
}