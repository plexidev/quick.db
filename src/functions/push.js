const util = require('util'),
  _ = require('lodash/object');

module.exports = function(ID, data, options, db) {
  const getInfo = new Promise((resolve, error) => {

    // Configure Options
    if (!options) options = {};
    options = {
      target: options.target || undefined,
      table: options.table || 'json'
    }

    let response;

    function createDb() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      checkIfCreated(false)
    }

    function checkIfCreated(updated) {

      // Fetch Row
      let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(ID);

      if (!fetched || !fetched.json && !updated) insertRow();
      else {
        fetched = JSON.parse(fetched.json);

        if (!options || !options.target || typeof fetched !== 'object' || fetched instanceof Array) {
          try {

            let array;
            if (JSON.stringify(fetched) === '{}') array = [data];
            else {
              array = fetched;
              array.push(data);
            }

            util.inspect(array);
            array = JSON.stringify(array);

            db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(array, ID);

          } catch (e) {
            response = `Unable to push, may not be pushing to an array. \nError: ${e.message}`;
            returnDb();
          }
        } else {

          let targets = options.target;
          if (targets[0] === '.') targets = targets.slice(1);

          let newArray = _.get(fetched, targets);
          if (newArray instanceof Array) newArray.push(data);
          else newArray = [data];

          let input = _.set(fetched, targets, newArray);
          util.inspect(input);
          input = JSON.stringify(input);

          db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(input, ID);

        }

        let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(ID).json;
        response = JSON.parse(newData);
        returnDb();

      }

    }

    function insertRow() {
      db.prepare(`INSERT INTO ${options.table} (ID,json) VALUES (?,?)`).run(ID, '{}');
      checkIfCreated(true);
    }

    function returnDb() {
      return resolve(response);
    }

    createDb();

  });
  return getInfo;
}