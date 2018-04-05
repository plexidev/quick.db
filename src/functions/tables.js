module.exports = function(options, db) {
  const getInfo = new Promise((resolve, error) => {

    let response = [];
    
    if (!options) options = {};
    options = {
      table: options.table || 'json'
    }

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
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