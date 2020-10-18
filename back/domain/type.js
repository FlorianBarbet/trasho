'user strict';
const imp = require('../import.js');
const JSONable = imp.jsonable();

class Type extends JSONable{
    #id_type_poubelle;
    type;

    constructor
    (
        id_type_poubelle = 'undefined',
        type = 'undefined',
    ){
        super();
        this.#id_type_poubelle = id_type_poubelle;
        this.type = type;
    }

    static fromJSON(type){
        return new Type(
            type.id_type_poubelle,
            type.type,
        );
    }
    
    static tablename(){ return 'type_poubelle'; }
    identifiant() { return this.#id_type_poubelle; }
    content() {
        return{
            id_type_poubelle : this.#id_type_poubelle,
            type : this.type,
        }
    }

    id(id_type_poubelle=undefined){
        if(id_type_poubelle !== undefined)
            this.#id_type_poubelle = id_type_poubelle;
        return this.#id_type_poubelle;
    }
}

module.exports = Type;