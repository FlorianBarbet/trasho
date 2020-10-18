const connector = require("../connector.js");
/*Ce test sera supprimé lors de la mise en place de l'application*/
/* Il ne sert pas à grand chose ... Juste à comprendre */
/*Comment utiliser le module pg en relation avec Jest*/
test('should return a number of user in my db (1)',() => {
  connector.getUsers().then(
    res => {
      expect(res.rowCount).toEqual(1);
      connector.close();
    }
  ).catch(error => console.log(error, "Test servant de POC et de formation"));
});
