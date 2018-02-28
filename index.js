const sqlite3 = require('sqlite3');
const util = require('util');
const _ = require('lodash/object');

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
                        else if (!options || (typeof JSON.parse(row.json) !== 'object') || (JSON.parse(row.json) instanceof Array)) response = JSON.parse(row.json);
                        else {
                            let targets = options.target.split('.');
                            if (targets[0] === '') targets.shift()
                            targets = targets.join('.');
                            console.log(JSON.parse(row.json), targets)
                            response = _.get(JSON.parse(row.json), targets)
                        }
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
    setDebug: function(ID, data, options) {
        const getInfo = new Promise((resolve, error) => {

            // Configure Options
            if (options) {
                options = {
                    target: options.target || null
                }
            }

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
                        if (!options || (typeof JSON.parse(row.json) !== 'object') || (JSON.parse(row.json) instanceof Array)) {
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, test, ID);
                        } else {
                            let targets = options.target.split('.');
                            if (targets[0] === '') targets.shift()
                            targets = targets.join('.');
                            var input = _.set(JSON.parse(row.json), targets, data)
                            input = JSON.stringify(input)
                            db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID)
                        }
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
                        let json = JSON.parse(row.json);
                        if (!options || (typeof JSON.parse(row.json) !== 'object') || (JSON.parse(row.json) instanceof Array)) console.log('Error: .add() target is not a number.');
                      if (typeof json === 'number') {
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, (json + data), ID);
                            } 
                        else {
                            if (row.json === '{}') json = 0;

                        
                                let targets = options.target.split('.');
                                if (targets[0] === '') targets.shift()
                                targets = targets.join('.');
                                let input = _.set(json, targets, (_.get(json, targets) + data))
                                input = JSON.stringify(input)
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID)
                            }

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
                        let json = JSON.parse(row.json);
                        if (!options || (typeof JSON.parse(row.json) !== 'object') || (JSON.parse(row.json) instanceof Array)) console.log('Error: .subtract() target is not a number.');
                        else {
                            if (row.json === '{}') json = 0;

                            if (typeof json === 'number') {
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, (json - data), ID);
                            } else {
                                let targets = options.target.split('.');
                                if (targets[0] === '') targets.shift()
                                targets = targets.join('.');
                                let input = _.set(json, targets, (_.get(json, targets) - data))
                                input = JSON.stringify(input)
                                db.run(`UPDATE json SET json = (?) WHERE ID = (?)`, input, ID)
                            }

                            db.get(`SELECT * FROM json WHERE ID = (?)`, ID, function(err, row) {
                                if (row.json === '{}') response = null;
                                else response = JSON.parse(row.json);
                                returnDb();
                            });
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