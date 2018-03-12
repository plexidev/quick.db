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
              checkIfCreated();
            }

            function checkIfCreated() {
              
              let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
              
              if (!fetched) insertRow();
              else {
               
                if (fetched === '{}') response = null;
                
                fetched = JSON.parse(fetched);
                if (!options || typeof fetched !== 'object' || fetched instanceof Array) response = fetched;
                else {
                   
                  let targets = options.target;
                  if (targets[0] === '.') targets.slice(1);
                  response = _.get(fetched, targets);
                  
                }
                
                returnDb();
                
              }
              
            }

            function insertRow() {
              db.prepare(`INSERT INTO json (ID,json) VALUES (?,?)`).run(ID, '{}');
              checkIfCreated();
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
              checkIfCreated();
            }

            function checkIfCreated() {
                
              // Fetch Row
              let fetched = db.prepare(`SELECT * FROM json WHERE ID = (?)`).get(ID).json;
              
              if (!fetched) insertRow(); // Run if undefined
              else { // Run if defined
                
                // Update Data
                if (!options || typeof JSON.parse(fetched) !== 'object' || JSON.parse(fetched) instanceof Array) {
                  db.prepare(`UPDATE json SET json = (?) WHERE ID = (?)`).run(input, ID);
                } else { // if (typeof input === 'object')
                  
                  let targets = options.target;
                  if (targets[0] === '.') targets.slice(1);
                  
                  let object = _.set(JSON.parse(fetched), targets, input);
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
              checkIfCreated();
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
              let info = db.prepare(`DELETE FROM json WHERE ID = (?)`).run(ID);
              console.log(info);
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
            let db;
            let response;

            function createDb() {
                db = new Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else {
                        if (!options || (typeof JSON.parse(row.json) !== 'object') || (JSON.parse(row.json) instanceof Array)) {
                            try {
                                var array;
                                if (row.json === '{}') {
                                    array = [data];
                                } else {
                                    array = JSON.parse(row.json);
                                    array.push(data);
                                }
                                util.inspect(array);
                                array = JSON.stringify(array);
                            } catch (e) {
                                response = `Unable to push, may not be pushing to an array. \nError: ${e.message}`;
                                returnDb();
                            }
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, array, ID);
                        } else {
                            let targets = options.target.split('.');
                            if (targets[0] === '') targets.shift()
                            targets = targets.join('.');
                            let newArray = _.get(JSON.parse(row.json), targets)
                            if (newArray instanceof Array) newArray.push(data)
                            else newArray = [data]
                            let input = _.set(JSON.parse(row.json), targets, newArray)
                            input = JSON.stringify(input)
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID)
                        }
                        db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                            response = JSON.parse(row.json)
                            returnDb();
                        })
                    }
                });
            }

            function insertRows() {
                db.run("INSERT INTO json (ID,json) VALUES (?,?)", ID, "{}", checkIfCreated);
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
            let db;
            let response;

            function createDb() {
                db = new Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else { // Run when row is created, with the object {}
                        if (typeof data !== 'number') return console.log('Level 0', `Error: Input for .add(${ID},${data}) is not a valid number.`);
                        let json;
                        if (row.json === '{}' && !options) json = 0;
                        else json = JSON.parse(row.json);
                        // Check if the target is already a number
                        if (typeof json === 'number') {
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, (json + data), ID);
                        } else if (typeof json === 'object' && options && options.target !== null) { // If not, check if another target in an object is a number
                            let targets = options.target.split('.');
                            if (targets[0] === '') targets.shift();
                            targets = targets.join('.');
                            let target = _.get(json, targets);
                            if (typeof target === 'number' || target === undefined) { // Run if target is a number
                                if (target === undefined) target = 0;
                                let input = _.set(json, targets, (target + data));
                                util.inspect(input);
                                input = JSON.stringify(input);
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID);
                            } else {
                                console.log('Level 2', `Error: Target for .add(${ID},${data}) is not a valid number.`);
                            }
                        } else {
                            console.log('Level 1', `Error: Target for .add(${ID},${data}) is not a valid number.`);
                        }
                        // Once those are complete, run the fetch
                        db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                            if (row.json === '{}') response = null;
                            else response = JSON.parse(row.json);
                            returnDb();
                        });
                    }
                });
            }

            function insertRows() {
                db.run("INSERT INTO json (ID,json) VALUES (?,?)", ID, "{}", checkIfCreated);
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
            if (typeof data !== 'number') return console.log('Error: .subtract() data is not a number.');
            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }
            let db;
            let response;

            function createDb() {
                db = new Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else {
                        if (typeof data !== 'number') return console.log('Level 0', `Error: Input for .subtract(${ID},${data}) is not a valid number.`);
                        let json;
                        if (row.json === '{}' && !options) json = 0;
                        else json = JSON.parse(row.json);
                        // Check if the target is already a number
                        if (typeof json === 'number') {
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, (json + data), ID);
                        } else if (typeof json === 'object' && options && options.target !== null) { // If not, check if another target in an object is a number
                            let targets = options.target.split('.');
                            if (targets[0] === '') targets.shift();
                            targets = targets.join('.');
                            let target = _.get(json, targets);
                            if (typeof target === 'number' || target === undefined) { // Run if target is a number
                                if (target === undefined) target = 0;
                                let input = _.set(json, targets, (target - data));
                                util.inspect(input);
                                input = JSON.stringify(input);
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID);
                            } else {
                                console.log('Level 2', `Error: Target for .subtract(${ID},${data}) is not a valid number.`);
                            }
                        } else {
                            console.log('Level 1', `Error: Target for .subtract(${ID},${data}) is not a valid number.`);
                        }
                        // Once those are complete, run the fetch
                        db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                            if (row.json === '{}') response = null;
                            else response = JSON.parse(row.json);
                            returnDb();
                        });
                    }
                });
            }

            function insertRows() {
                db.run("INSERT INTO json (ID,json) VALUES (?,?)", ID, "{}", checkIfCreated);
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