/*========================================================*/
/*========================================================*/
/*===                      WARNING                     ===*/
/*
Si il y a un probleme avec cette partie contactez imperativement
FLORIAN BARBET
Cette classe est particuliere
*/
/*========================================================*/
/*========================================================*/

class JSONable{

  constructor(){
  if (this.constructor === JSONable) {
      throw new TypeError('Abstract "JSONable" cannot be instantiated directly');
    }
  }

  static tablename(){
    throw new Error('You must implement this function');
  }

  content(){
    throw new Error('You must implement this function');
  }

  identifiant(){
    throw new Error('You must implement this function');
  }


  conversion(){
    return {
            tablename : this.tablename(),
            content: this.content(),
          };
  }

  static fromJSON(json){
    throw new Error('You must implement this function');
  }

  static loadList(list){
    let jsons = {};
    jsons[this.tablename()] = {};
    for( let key in list ){
      let json = this.fromJSON(list[key]);
      let id = json.identifiant();
      jsons[this.tablename()][id] = json.content();
    }
    return jsons;
  }

  static loadUnic(list){
    let json = {};
    if(list.length > 1)
      throw new Error("There is more than 1 result");

    for( let key in list ){
      json = this.fromJSON(list[key]);
    }
    return json;
  }

}

module.exports = JSONable;
