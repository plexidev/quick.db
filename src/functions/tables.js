module.exports = function(db) {
  const getInfo = new Promise((resolve, error) => {

    let response = [];
    
    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)`).run();
      fetchAll();
    }

    function fetchAll() {
      let tables = db.prepare(`select name from sqlite_master where type='table'`).all();
      tables.forEach(function(table){
        response.push(table.name) 
      })
      returnDb();
    }

    function returnDb() {
      return resolve(response);
    }

    createDb();

  });
  return getInfo;
}