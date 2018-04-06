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

    // Define Variables
    let response,
      input;

    // Test Data
    try {
      util.inspect(data);
      input = JSON.stringify(data);
    } catch (e) {
      return console.log(`Please supply a valid input @ ID: ${ID}\nError: ${e.message}`);
    }

    // Check if setting undefined
    if (typeof data === 'undefined') return console.log(`Input cannot be undefined @ ID: ${ID}`);

    // Statements
    function newConnection() {
      db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();
      checkIfCreated(false);
    }

    function checkIfCreated(updated) {

      // Fetch Row
      let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(ID);

      if (!fetched || !fetched.json && !updated) insertRow(); // Run if undefined
      else { // Run if defined
        fetched = JSON.parse(fetched.json);

        // Update Data
        if (!options || !options.target || typeof fetched !== 'object' || fetched instanceof Array) {
          db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(input, ID);
        } else { // if (typeof input === 'object')

          let targets = options.target;
          if (targets[0] === '.') targets = targets.slice(1);

          input = JSON.parse(input)
          let object = _.set(fetched, targets, input);
          util.inspect(object);
          object = JSON.stringify(object);

          db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(object, ID);

        }

        // Fetch New Data
        let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(ID).json;
        if (newData === '{}') response = null;
        else response = JSON.parse(newData);
        returnDb();
      }

    }

    function insertRow() {

      db.prepare(`INSERT INTO ${options.table} (ID,json) VALUES (?,?)`).run(ID, '{}');
      checkIfCreated(true);

    }

    function returnDb() {
      resolve(response);
    }

    newConnection();

  });
  return getInfo;
}