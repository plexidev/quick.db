const util = require('util'),
      get = require('lodash.get');

module.exports = function(ID, options = {}, db) {
  const getInfo = new Promise((resolve) => {

    // Configure Options
    options = {
      target: options.target || undefined,
      table: options.table || 'json'
    };

    let response;

    function newConnection() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      checkIfCreated(false);
    }

    function checkIfCreated(updated) {

      // Fetch Entry
      let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(ID);
      if (!fetched) response = null;
      else {
        fetched = fetched.json;
        if (fetched === '{}') response = null;
        else {
          fetched = JSON.parse(fetched);
          if (!options || !options.target || typeof fetched !== 'object' || fetched instanceof Array) response = fetched;
          else {
            let targets = options.target;
            if (targets[0] === '.') targets = targets.slice(1);
            response = get(fetched, targets);
          }
        }
      }

      returnDb();

    }

    function returnDb() {
      resolve(response);
    }

    newConnection();

  });
  return getInfo;
};
