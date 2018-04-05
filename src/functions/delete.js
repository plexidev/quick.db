module.exports = function(ID, options, db) {
  const getInfo = new Promise((resolve, error) => {

    // Configure Options
    if (!options) options = {};
    options = {
      table: options.table || 'json'
    }

    let response;

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      deleteRow();
    }

    function deleteRow() {
      db.prepare(`DELETE FROM ${options.table} WHERE ID = (?)`).run(ID);
      response = true;
      returnDb();
    }

    function returnDb() {
      return resolve(response);
    }

    createDb();

  });
  return getInfo;
}