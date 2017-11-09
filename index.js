// Dependencies
const sqlite3 = require('sqlite3').verbose();

/* 
 * Thank you for using quick.db!
 * Author: TrueXPixels (youtube.com/c/TrueXPixels)
 */

module.exports = {

    updateValue: function (ID, increase) {

        const getInfo = new Promise((resolve, error) => {

            // Turns increase into a number automatically
            increase = parseInt(increase);

            // Check if increase is a number
            if (isNaN(increase)) {
                console.log('INCREASE VALUE is NOT A NUMBER');
                return error('ERROR: INCREASE VALUE is NOT A NUMBER')
            }

            let db;
            let response;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./database.sqlite', createTable)
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER, text TEXT)")
                checkIfCreated()
            }

            function checkIfCreated() { // Check if row exists w/ ID
                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {

                    if (!row) { // Run if it doesn't exist...
                        insertRows()
                    } else { // Run if it does exist...
                        db.run(`UPDATE database SET value = (?) WHERE ID = (?)`, row.value + increase, ID);
                        db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {
                            response = row;
                            returnDb()
                        })
                    }

                })
            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO database (ID,value,text) VALUES (?,?,?)", ID, 0, "", checkIfCreated)
            }

            function returnDb() { // Return Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo

    },

    fetchObject: function (ID) {
        const getInfo = new Promise((resolve) => {

            let db;
            let response;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./database.sqlite', createTable)
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER, text TEXT)", checkIfCreated)
            }

            function checkIfCreated() { // Check if row exists w/ ID

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {
                    if (!row) { // Run if row not found...
                        insertRows()
                    } else { // Run if row found...
                        response = row;
                        returnDb()
                    }
                })

            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO database (ID,value,text) VALUES (?,?,?)", ID, 0, "", checkIfCreated)
            }

            function returnDb() { // Return Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo

    },

    updateText: function (ID, text) {
        const getInfo = new Promise((resolve, error) => {

            // Check if text is a string
            if (typeof text !== 'string') {
                console.log('TEXT is NOT A STRING');
                return error('ERROR: TEXT is NOT A STRING')
            }

            let db;
            let response;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./database.sqlite', createTable);
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER, text TEXT)", checkIfCreated);
            }

            function checkIfCreated() { // Check if row exists w/ ID

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {
                    if (!row) {
                        insertRows()
                    } else {
                        db.run(`UPDATE database SET text = (?) WHERE ID = (?)`, text, ID);
                        db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {
                            response = row;
                            returnDb()
                        })
                    }
                })

            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO database (ID,value,text) VALUES (?,?,?)", ID, 0, "", checkIfCreated)
            }

            function returnDb() { // Returns Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo;

    },

    fetchValue: function (ID) { // THIS IS DEPRECATED. USE fetchObject(ID).then(i => {})
    
        console.log("\nQUICK.DB WARNING: 'fetchValue(ID).then(i => {})' is deprecated. Please use 'fetchObject(ID).then(i => {})")
        console.log("QUICK.DB WARNING: 'fetchValue(ID).then(i => {})' is deprecated. Please use 'fetchObject(ID).then(i => {})\n")
                    
        const getInfo = new Promise((resolve) => {

            let db;
            let response;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./database.sqlite', createTable)
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER, text TEXT)", checkIfCreated)
            }

            function checkIfCreated() { // Check if row exists w/ ID

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function (err, row) {
                    if (!row) { // Run if row not found...
                        insertRows()
                    } else { // Run if row found...
                        response = row;
                        returnDb()
                    }
                })

            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO database (ID,value,text) VALUES (?,?,?)", ID, 0, "", checkIfCreated)
            }

            function returnDb() { // Return Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo

    },


};