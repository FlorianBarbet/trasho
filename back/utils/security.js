'user strict'
const imp = require('../import.js');
const props = imp.prop();
const domainSecurity = imp.domainSecurity();
const Utilisateur = imp.utilisateur();
const CustomServerError = imp.serverError();

module.exports.tokenApplication = (req) => {
  let { token_api } = req.headers;
  let auth = false;
  console.log(token_api);
  if(req.baseUrl.startsWith("/api/user/confirmMail")){
    return true;
  }
  
  if(token_api !== undefined  || token_api !== null)
    if(token_api === props.token_api)
      auth = true;
  return auth;
}

module.exports.administrateur = async (req) => {
  let { token_user } = req.headers;
  let user = await domainSecurity.sendUserByToken(token_user);
  console.log(user);
  if(!user.flag_admin){
    throw new CustomServerError("Forbidden Access : Administrator Level",401);
  }
}
