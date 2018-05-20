module.exports = function(options = {}, db) {
  const getInfo = new Promise((resolve, error) => {

    let response = [];
    
    options = {
      table: options.table || 'json'
    };

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      fetchAll();
    }

    function fetchAll() {
      let resp = db.prepare(`SELECT * FROM ${options.table}`).all();
      for (var entry of resp) {
        if (entry.ID !== null && entry.ID !== "WEBVIEW_ACTIVE_SOCKETS") {
          response.push({
            ID: entry.ID,
            data: JSON.parse(entry.json)
          });
        }
      }
      returnDb();
    }

    function returnDb() {
      return resolve(response);
    }

    createDb();

  });
  return getInfo;
};
