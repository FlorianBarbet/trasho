'user strict';
const imp = require('../import.js');
const JSONable = imp.jsonable();

class Utilisateur extends JSONable{
  #mail;
  password;
  flag_admin;
  token;
  date_expire;
  experience;
  actif;
  niveau;

  constructor
  (
    mail = 'undefined',
    password = 'undefined',
    flag_admin = 'undefined',
    token = 'undefined',
    date_expire = 'undefined',
    experience = 'undefined',
    actif = 'undefined',
    niveau = 'undefined'
  ){
    super();
    this.#mail = mail,
    this.password = password;
    this.flag_admin = flag_admin;
    this.token = token;
    this.date_expire = date_expire;
    this.experience = experience;
    this.actif = actif;
    this.niveau = niveau;
  }

  static fromJSON(user){
    /*Attention : signa n'est pas un objet signalement mais un JSON*/
    return new Utilisateur(
      user.mail,
      user.password,
      user.flag_admin,
      user.token,
      user.date_expire,
      user.experience,
      user.actif,
      user.niveau
    );
  }

  static tablename(){ return 'utilisateur';}
  identifiant() { return this.#mail; }
  content() {
    return {
      mail : this.#mail,
      password : this.password,
      flag_admin : this.flag_admin,
      token : this.token,
      date_expire : this.date_expire,
      experience : this.experience,
      actif : this.actif,
      niveau : this.niveau
    }
  }

  id(mail=undefined){
    /*Getter et setter */
    if(mail !== undefined)
      this.#mail = mail;
    return this.#mail;
  }

  isAdmin(){
    return this.flag_admin;
  }


}

module.exports = Utilisateur;
