'user strict';
const imp = require('../import.js');
const JSONable = imp.jsonable();
const Poubelle = imp.poubelle();

class Signalement extends JSONable{
  #id_signalement; /*private : #*/
  utilisateur;
  poubelle;
  id_type_signalement;
  date_signalement;
  type;

  constructor
  (
    id_signalement = 'undefined',
    utilisateur = 'undefined',
    poubelle = 'undefined',
    id_type_signalement = 'undefined',
    date_signalement = 'undefined',
    type = 'undefined'
  ){
    super();
    this.#id_signalement      = id_signalement;
    this.id_type_signalement  = id_type_signalement;
    this.poubelle          = poubelle;
    this.date_signalement     = date_signalement;
    this.utilisateur                 = utilisateur;
    this.type                 = type;

  }

  static fromJSON(signa){
    /*Attention : signa n'est pas un objet signalement mais un JSON*/
    return new Signalement(
            signa.id_signalement,
            new Utilisateur(
              signa.utilisateur,
              signa.password,
              signa.flag_admin,
              signa.token,
              signa.date_expire,
              signa.experience,
              signa.actif
            ),
            new Poubelle( signa.id_poubelle,
                          signa.longitude,
                          signa.latitude,
                          signa.url_photo,
                          signa.type_poubelle),
            signa.id_type_signalement,
            signa.date_signalement,
            signa.type
          );
  }

  static tablename(){ return 'signalement';}
  identifiant() { return Signalement.tablename()+'_'+this.#id_signalement; }
  content() {
    return {
      id_signalement : this.#id_signalement,
      utilisateur : this.utilisateur.content(),
      poubelle : this.poubelle.content(),
      id_type_signalement : this.id_type_signalement,
      date_signalement : this.date_signalement,
      type : this.type
    }
  }

  id(id_signalement=undefined){
    /*Getter et setter */
    if(id_signalement !== undefined)
      this.#id_signalement = id_signalement;
    return this.#id_signalement;
  }


}

module.exports = Signalement;
