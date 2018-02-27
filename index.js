const sqlite3 = require('sqlite3');
const util = require('util');

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
  
    fetch: function(ID) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "fetchDebug",
                "args": [ID],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
    set: function(ID, data) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "setDebug",
                "args": [ID, data],
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
    push: function(ID, data) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "pushDebug",
                "args": [ID, data],
                "innerFunc": [resolve, error]
            }, queue);
        });
    },
  
    fetchDebug: function(ID) {
        const getInfo = new Promise((resolve) => {
            let db;
            let response;

            function createDb() {
                db = new sqlite3.Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else {
                        if (row.json === '{}') response = null;
                        else response = JSON.parse(row.json);
                        returnDb();
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
    setDebug: function(ID, data) {
        const getInfo = new Promise((resolve, error) => {

            try {
                var test;
                util.inspect(data)
                test = JSON.stringify(data);
            } catch (e) {
                return console.log(`PLEASE SUPPLY AN OBJECT/JSON FOR ID: ${ID}\nProper Error: ${e.message}`);
            }
            let db;
            let response;

            function createDb() {
                db = new sqlite3.Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else {
                        db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, test, ID);
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
    deleteDebug: function(ID) {
  const getInfo = new Promise((resolve, error) => {

            let db;
            let response;

            function createDb() {
                db = new sqlite3.Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", deleteRow);
            }

    
            function deleteRow() {
                db.run(`DELETE FROM json WHERE ID = (?)`, ID, function(err) {
                  if (err) response = false;
                  else response = true;
                  returnDb();
                });
            }

            function returnDb() {
                db.close();
                return resolve(response);
            }
            createDb();
        });
      return getInfo;
    },
    pushDebug: function(ID, data) {
        const getInfo = new Promise((resolve, error) => {
          
            let db;
            let response;

            function createDb() {
                db = new sqlite3.Database('./json.sqlite', createTable);
            }

            function createTable() {
                db.run("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows();
                    } else {
                            try {
                              var array = JSON.parse(row.json)
                              array.push(data)
                              var test;
                              util.inspect(array)
                              test = JSON.stringify(array);
                              db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, test, ID);
                              db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                                response = JSON.parse(row.json)
                                returnDb();
                              })
                            } catch (e) {
                              response = `Unable to push, may not be pushing to an array. \nError: ${e.message}`;
                              returnDb();
                            }
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