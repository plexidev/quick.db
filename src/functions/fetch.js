const util = require('util'),
      _ = require('lodash/object');

module.exports = function(ID, options, db) {
    const getInfo = new Promise((resolve) => {

        // Configure Options
        if (options) {
            options = {
                target: options.target || null
            }
        }

        let response;

        function newConnection() {
            db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
            checkIfCreated(false);
        }

        function checkIfCreated(updated) {
            
            // Fetch Entry
            let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);
            if (!fetched) response = null;
            else {
              fetched = fetched.json;
              if (fetched === '{}') response = null;
              else {
                fetched = JSON.parse(fetched);
                if (!options || typeof fetched !== 'object' || fetched instanceof Array) response = fetched;
                else {
                  let targets = options.target;
                  if (targets[0] === '.') targets = targets.slice(1);
                  response = _.get(fetched, targets);
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
}