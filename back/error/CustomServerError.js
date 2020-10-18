class CustomServerError extends Error {
  constructor(message,code, ...params) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super(...params);


    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomServerError);
    }
    this.name = 'CustomServerError';
    // Informations de déboguage personnalisées
    this.message = message;
    this.code = code;
    this.date = new Date();
  }


}

module.exports = CustomServerError;
