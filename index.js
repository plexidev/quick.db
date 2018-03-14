// Require Packages
const Database = require('better-sqlite3'),
      util = require('util'),
      _ = require('lodash/object');

let queue = [];

function executeQueue(object, queue) {
    if (object) {
        queue.push(object);
        if (queue.length > 1) return;
    }
    switch (queue.length) {
        case 0:
            break;
        default:
            let realObj = object ? object : queue[0];
            tools[realObj.fun](...realObj.args).then((...result) => {
                realObj.innerFunc[0](...result);
                queue.shift();
                executeQueue(null, queue);
            }).catch((...err) => {
                realObj.innerFunc[1](...err);
                queue.shift();
                executeQueue(null, queue);
            });
    }
}

var tools = module.exports = {
    fetch: function(ID, options) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "fetchDebug",
                "args": [ID, options],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    set: function(ID, data, options) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "setDebug",
                "args": [ID, data, options],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    delete: function(ID) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "deleteDebug",
                "args": [ID],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    push: function(ID, data, options) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "pushDebug",
                "args": [ID, data, options],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    add: function(ID, data, options) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "addDebug",
                "args": [ID, data, options],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    subtract: function(ID, data, options) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "subtractDebug",
                "args": [ID, data, options],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    fetchDebug: function(ID, options) {
        const getInfo = new Promise((resolve) => {
          
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
          
            let db,
                response;

            function newConnection() {
              db = new Database('./json.sqlite');
              db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
              checkIfCreated(false);
            }

            function checkIfCreated(updated) {
              
              let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);
              
              if (!fetched || !fetched.json && !updated) insertRow(); // Run if undefined
              else { // Run if defined
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
                returnDb();
                
              }
              
            }

            function insertRow() {
              db.prepare(`INSERT INTO json (ID,json) VALUES (?,?)`).run(ID, '{}');
              checkIfCreated(true);
            }

            function returnDb() {
                db.close();
                resolve(response);
            }
          
            newConnection();
          
        });
        return getInfo;
    },
    setDebug: function(ID, data, options) {
        const getInfo = new Promise((resolve, error) => {
            
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
          
            // Define Variables
            let db,
                response,
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
              db = new Database('./json.sqlite');
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

                  let object = _.set(fetched, targets, input);
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
                db.close();
                resolve(response);
            }
          
            newConnection();
          
        });
        return getInfo;
    },
    deleteDebug: function(ID) {
        const getInfo = new Promise((resolve, error) => {
          
            let db,
            response;

            function createDb() {
              db = new Database('./json.sqlite');
              db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
              deleteRow();
            }

            function deleteRow() {
              db.prepare(`DELETE FROM json WHERE ID = (?)`).run(ID);
              response = true;
              returnDb();
            }

            function returnDb() {
                db.close();
                return resolve(response);
            }
            
            createDb();
        
        });
        return getInfo;
    },
    pushDebug: function(ID, data, options) {
        const getInfo = new Promise((resolve, error) => {
            
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
            
            let db,
                response;

            function createDb() {
                db = new Database('./json.sqlite');
                db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
                checkIfCreated(false)
            }

            function checkIfCreated(updated) {
                
                // Fetch Row
                let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);

                if (!fetched || !fetched.json && !updated) insertRow(); 
                else {
                    fetched = JSON.parse(fetched.json);
                    
                    if (!options || typeof fetched !== 'object' || fetched instanceof Array) {
                        try {

                            let array;
                            if (JSON.stringify(fetched) === '{}') array = [data];
                            else {
                                array = fetched;
                                array.push(data);
                            }
                            
                            util.inspect(array);
                            array = JSON.stringify(array);
                          
                            db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(array, ID);
                            
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
                        
                        db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(input, ID);
                        
                    }
                    
                    let newData = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
                    response = JSON.parse(newData);
                    returnDb();
                    
                }
                
            }

            function insertRow() {
                db.prepare(`INSERT INTO json (ID,json) VALUES (?,?)`).run(ID, '{}');
                checkIfCreated(true);
            }

            function returnDb() {
                db.close();
                return resolve(response);
            }
            
            createDb();
            
        });
        return getInfo;
    },
    addDebug: function(ID, data, options) {
        const getInfo = new Promise((resolve, error) => {
            
            if (typeof data !== 'number') return console.log('Error: .add() data is not a number.');
            
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
            
            let db,
                response;

            function createDb() {
                db = new Database('./json.sqlite');
                db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
                checkIfCreated(true);
            }

            function checkIfCreated(updated) {
                
                // Fetch Row
                let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);
                
                if (!fetched || !fetched.json && !updated) insertRow();
                else {
                    fetched = fetched.json;
                    
                    let json;
                    if (fetched === '{}' && !options) json = 0;
                    else json = JSON.parse(fetched);

                    if (typeof json === 'number') db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(json + data, ID);
                    else {
                        if (typeof json === 'object' && options && options.target !== null) {

                            let targets = options.target;
                            if (targets[0] === '.') targets = targets.slice(1);
                            
                            let target = _.get(json, targets);
                            if (typeof target === 'number' || target === undefined) {
                                if (target === undefined) target = 0;
                                
                                let input = _.set(json, targets, target + data);
                                util.inspect(input);
                                input = JSON.stringify(input);
                                db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(input, ID);
                                
                            } else console.log(`Error: Target for .add(${ID}, ${data}) is not a number.`);
                            
                        } else console.log(`Error: Target for .add(${ID}, ${data}) is not a number.`);
                    
                    }
                    
                    let newData = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
                    if (newData === '{}') response = null;
                    else response = JSON.parse(newData);

                    returnDb();
                
                }
                
            }

            function insertRow() {
                db.prepare("INSERT INTO json (ID,json) VALUES (?,?)").run(ID, '{}');
                checkIfCreated(true);
            }

            function returnDb() {
                db.close();
                return resolve(response);
            }
            
            createDb();
            
        });
        return getInfo;
    },
    subtractDebug: function(ID, data, options) {
        const getInfo = new Promise((resolve, error) => {
            
            if (typeof data !== 'number') return console.log('Error: .add() data is not a number.');
            
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
            
            let db,
                response;

            function createDb() {
                db = new Database('./json.sqlite');
                db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
                checkIfCreated(true);
            }

            function checkIfCreated(updated) {
                
                // Fetch Row
                let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID);
                
                if (!fetched && !updated) insertRow();
                else {
                    fetched = fetched.json;
                    
                    let json;
                    if (fetched === '{}' && !options) json = 0;
                    else json = JSON.parse(fetched);
                    
                    if (typeof json === 'number') db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(json - data, ID);
                    else {
                        if (typeof json === 'object' && options && options.target !== null) {
                            
                            let targets = options.target;
                            if (targets[0] === '.') targets = targets.slice(1);
                            
                            let target = _.get(json, targets);
                            if (typeof target === 'number' || target === undefined) {
                                if (target === undefined) target = 0;
                                
                                let input = _.set(json, targets, target - data);
                                util.inspect(input);
                                input = JSON.stringify(input);
                                db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(input, ID);
                                
                            } else console.log(`Error: Target for .subtract(${ID}, ${data}) is not a number.`);
                            
                        } else console.log(`Error: Target for .subtract(${ID}, ${data}) is not a number.`);
        
                    }
                    
                    let newData = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
                    if (newData === '{}') response = null;
                    else response = JSON.parse(newData);

                    returnDb();
                    
                }
                
            }

            function insertRow() {
                db.prepare("INSERT INTO json (ID,json) VALUES (?,?)").run(ID, '{}');
                checkIfCreated(true);
            }

            function returnDb() {
                db.close();
                return resolve(response);
            }
            
            createDb();
            
        });
        return getInfo;
    }
};