const sort = require('lodash.sortby');

module.exports = function(startsWith, options = {}, db) {
  const getInfo = new Promise((resolve, error) => {

    if (typeof startsWith !== 'string') return error(new TypeError('db.startsWith(text) | text is not a string.'));

    // Parse Options
    options = {
      sort: options.sort || undefined,
      table: options.table || 'json'
    };
    
    let response = [];

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      fetchAll();
    }

    function fetchAll() {
      let resp = db.prepare(`SELECT * FROM ${options.table}`).all();
      for (var entry of resp) { // Faster than forEach
        if (entry.ID === null) continue;
        if (entry.ID === 'WEBVIEW_ACTIVE_SOCKETS') continue;
        if (!entry.ID.startsWith(startsWith)) continue;
        response.push({
          ID: entry.ID,
          data: JSON.parse(entry.json)
        });
      }
      if (options && typeof options.sort === 'string') {
        if (options.sort.startsWith('.')) options.sort = options.sort.slice(1);
        options.sort = options.sort.split('.');
        response = sort(response, options.sort);
        response = response.reverse();
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
