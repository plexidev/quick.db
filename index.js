const sqlite3 = require('sqlite3').verbose();

// Thank you for using quick.db!

// If you need support, we have a github!

module.exports = {

    updateValue: function(ID, increase) {

        const getInfo = new Promise((resolve, error) => {

            // Turns increase into a number automatically
            increase = parseInt(increase);

            // Check if increase is a number
            if (isNaN(increase)) {
                console.log('INCREASE VALUE is NOT A NUMBER');
                return error('ERROR: INCREASE VALUE is NOT A NUMBER');
            }

            // Variables
            var db;
            var response;
            var log = false; // You can set this to true or false, it will log events in this function.

            function createDb() { // Root
                if (log) console.log('Creating Database Chain');
                db = new sqlite3.Database('./database.sqlite', createTable);
            }

            function createTable() { // Extends createDb
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER)", checkIfCreated);
            }

            function checkIfCreated() {
                if (log) console.log('Creating Table');
                db.get(`SELECT * FROM database WHERE ID = '${ID}'`, function(err, row) {
                    if (!row) {
                        insertRows();
                    }
                    else {
                        db.run(`UPDATE database SET value = '${row.value + increase}' WHERE ID = '${ID}'`)
                        db.get(`SELECT * FROM database WHERE ID = '${ID}'`, function(err, row) {
                            response = row;
                            returnDb();
                        });
                    }
                })
            }

            function insertRows() { // Extends createTable
                var stmt = db.prepare("INSERT INTO database (ID,value) VALUES (?,?)");

                stmt.run(ID, 0)

                stmt.finalize(readAllRows);
            }

            function readAllRows() { // Extends insertRows

                /**db.all("SELECT rowid AS id, ID, value, lastDaily FROM database", function(err, rows) { // This shows ALL rows
                    rows.forEach(function(row) {
                        console.log(row);
                    });
                    closeDb();
                });**/

                db.get(`SELECT * FROM database WHERE ID = '${ID}'`, function(err, row) {
                    closeDb()
                })

            }

            function closeDb() { // Extends readAllRows
                checkIfCreated()
                db.close();
            }

            function returnDb() {
                return resolve(response)
            }

            function runChain() {
                createDb();
            }

            runChain();

        });

        return getInfo;

    },

    fetchValue: function(ID) {
        const getInfo = new Promise((resolve) => {
            // Variables
            var db;
            let response;
            let log = false; // You can set this to true or false, it will log events in this function.

            function createDb() { // Root
                if (log) console.log('Creating Database Chain');
                db = new sqlite3.Database('./database.sqlite', createTable);
            }

            function createTable() { // Extends createDb
                if (log) console.log('Creating Table');
                db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER)", checkIfCreated);
            }

            function checkIfCreated() {
                db.get(`SELECT * FROM database WHERE ID = '${ID}'`, function(err, row) {

                    if (!row) { // Run if row not found...
                        insertRows();
                    }
                    else { // Run if row found...
                        if (log) console.log('Row Found... Closing...')
                        response = row;
                        returnDb();
                    }

                })

            }

            function insertRows() { // Extends createTable
                if (log) console.log('Inserting Rows');
                var stmt = db.prepare("INSERT INTO database (ID,value) VALUES (?,?)");

                stmt.run(ID, 0)

                stmt.finalize(readAllRows);
            }

            function readAllRows() { // Extends insertRows
                if (log) console.log('Display New Row');

                /**db.all("SELECT rowid AS id, ID, value, lastDaily FROM database", function(err, rows) { // This shows ALL rows
                    rows.forEach(function(row) {
                        console.log(row);
                    });
                    closeDb();
                });**/

                db.get(`SELECT * FROM database WHERE ID = '${ID}'`, function(err, row) {
                    response = row;
                    closeDb()
                })

            }

            function closeDb() { // Extends readAllRows
                if (log) console.log("Closing Database");
                db.close();
                returnDb();
            }

            function returnDb() {
                if (log) console.log(response)
                return resolve(response)
            }

            function runChain() {
                createDb();
            }

            runChain();



        });

        return getInfo;

    }

}
