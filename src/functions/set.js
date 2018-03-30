const util = require('util'),
      _ = require('lodash/object');

module.exports = function(ID, data, options, db) {
  const getInfo = new Promise((resolve, error) => {

            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
          
            // Define Variables
            let response,
                input;
          
            // Test Data
            try {
              util.inspect(data);
              input = JSON.stringify(data);
            } catch(e) {
              return console.log(`Please supply a valid input @ ID: ${ID}\nError: ${e.message}`); 
            }
            
            // Statements
            function newConnection() {
              db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
              checkIfCreated(false);
            }

            function checkIfCreated(updated) {
                
              // Fetch Row
              let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);
              
              if (!fetched || !fetched.json && !updated) insertRow(); // Run if undefined
              else { // Run if defined
                fetched = JSON.parse(fetched.json);
                
                // Update Data
                if (!options || typeof fetched !== 'object' || fetched instanceof Array) {
                  db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(input, ID);
                } else { // if (typeof input === 'object')
                  
                  let targets = options.target;
                  if (targets[0] === '.') targets = targets.slice(1);
                  
                  input = JSON.parse(input)
                  let object = _.set(fetched, targets, input);
                  util.inspect(object);
                  object = JSON.stringify(object);

                  db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(object, ID);
                  
                }
                
                // Fetch New Data
                let newData = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
                if (newData === '{}') response = null;
                else response = JSON.parse(newData);
                returnDb();
              }
              
            }

            function insertRow() {

              db.prepare(`INSERT INTO json (ID,json) VALUES (?,?)`).run(ID, '{}');
              checkIfCreated(true);
              
            }

            function returnDb() {
                resolve(response);
            }
          
            newConnection();
          
        });
        return getInfo;
}