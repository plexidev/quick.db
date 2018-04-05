const sort = require('array-sort');

module.exports = function(startsWith, options, db) {
  const getInfo = new Promise((resolve, error) => {

    if (typeof startsWith !== 'string') return console.log('ERROR: db.startsWith(text) | text is not a string.')

    // Parse Options
    if (!options) options = {};
    options = {
      sort: options.sort || undefined,
      table: options.table || 'json'
    }
    
    let response = [];

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      fetchAll();
    }

    function fetchAll() {
      let resp = db.prepare(`SELECT * FROM ${options.table}`).all();
      resp.forEach(function(entry) {
        if (entry.ID === null) return;
        if (entry.ID === 'WEBVIEW_ACTIVE_SOCKETS') return;
        if (!entry.ID.startsWith(startsWith)) return;
        response.push({
          ID: entry.ID,
          data: JSON.parse(entry.json)
        })
      })
      if (options && typeof options.sort === 'string') {
        if (options.sort.startsWith('.')) options.sort = options.sort.slice(1)
        response = sort(response, options.sort, {
          reverse: true
        })
      }
      returnDb();
    }

    function returnDb() {
      return resolve(response);
    }

    createDb();

  });
  return getInfo;
}