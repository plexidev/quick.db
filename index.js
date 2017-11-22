// Dependencies
const sqlite3 = require('sqlite3').verbose();

/* 
 * Thank you for using quick.db!
 * Author: TrueXPixels (youtube.com/c/TrueXPixels)
 */

module.exports = {

    setArray: function(ID, array) {
        const getInfo = new Promise((resolve, error) => {

            // Check if array is an object
            if (typeof array !== 'object') {
                console.log('ARRAY is NOT AN ARRAY');
                return error('ERROR: ARRAY is NOT AN ARRAY')
            }

            let db;
            let response;
            let arrayKey;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./arrays.sqlite', createTable);
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS arrays (ID TEXT, array TEXT)", checkForKey());
            }

            function checkForKey() { // Check if row exists w/ ID

                db.get(`SELECT * FROM arrays WHERE ID = (?)`, 'SECRET_ARRAYKEY_DONOTDELETE', function(err, row) {
                    if (!row || row.array === 'none') { // Run if row not found...
                        insertKey()
                    }
                    else { // Run if row found...
                        arrayKey = row.array
                        checkIfCreated()
                    }
                })

            }

            function insertKey() { // Create an empty row w/ ID

                let key = ''
                let possible = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϑϒϖ–—‚""„†‡•…‰‾€Π™←↑→↓↔↵⇐⇑⇒⇓⇔∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊄⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋〈〉◊♠♣♥♦ŒœŠšŸƒ'
                for (var i = 0; i < 15; i++) key += possible.charAt(Math.floor(Math.random() * possible.length));

                db.run("INSERT INTO arrays (ID,array) VALUES (?,?)", 'SECRET_ARRAYKEY_DONOTDELETE', key, checkForKey())
            }

            function checkIfCreated() { // Check if row exists w/ ID

                db.get(`SELECT * FROM arrays WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows()
                    }
                    else {
                        
                        let newArray = array.join(arrayKey)
                        
                        db.run(`UPDATE arrays SET array = (?) WHERE ID = (?)`, newArray, ID);
                        db.get(`SELECT * FROM arrays WHERE ID = (?)`, ID, function(err, row) {
                            response = row.array.split(arrayKey);
                            returnDb()
                        })
                    }
                })

            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO arrays (ID,array) VALUES (?,?)", ID, "", checkIfCreated)
            }

            function returnDb() { // Returns Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo;

    },

    fetchArray: function(ID) {
        const getInfo = new Promise((resolve) => {

            let db;
            let response;
            let arrayKey;

            function createDb() { // Create Database Chain
                db = new sqlite3.Database('./arrays.sqlite', createTable)
            }

            function createTable() { // Create table if it doesn't exist
                db.run("CREATE TABLE IF NOT EXISTS arrays (ID TEXT, array TEXT)", checkForKey)
            }

            function checkForKey() { // Check if row exists w/ ID

                db.get(`SELECT * FROM arrays WHERE ID = (?)`, 'SECRET_ARRAYKEY_DONOTDELETE', function(err, row) {
                    if (!row || row.array === 'none') { // Run if row not found...
                        insertKey()
                    }
                    else { // Run if row found...
                        arrayKey = row.array
                        checkIfCreated()
                    }
                })

            }

            function insertKey() { // Create an empty row w/ ID

                let key = ''
                let possible = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϑϒϖ–—‚""„†‡•…‰‾€Π™←↑→↓↔↵⇐⇑⇒⇓⇔∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊄⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋〈〉◊♠♣♥♦ŒœŠšŸƒ'
                for (var i = 0; i < 15; i++) key += possible.charAt(Math.floor(Math.random() * possible.length));

                db.run("INSERT INTO arrays (ID,array) VALUES (?,?)", 'SECRET_ARRAYKEY_DONOTDELETE', key, checkForKey())
            }

            function checkIfCreated() { // Check if row exists w/ ID

                db.get(`SELECT * FROM arrays WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) { // Run if row not found...
                        insertRows()
                    }
                    else { // Run if row found...
                        response = row.array.split(arrayKey);
                        returnDb()
                    }
                })

            }

            function insertRows() { // Create an empty row w/ ID
                db.run("INSERT INTO arrays (ID,array) VALUES (?,?)", ID, "", checkIfCreated)
            }

            function returnDb() { // Return Row
                db.close();
                return resolve(response)
            }

            createDb()

        });

        return getInfo

    },

    updateValue: function(ID, increase) {

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
                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {

                    if (!row) { // Run if it doesn't exist...
                        insertRows()
                    }
                    else { // Run if it does exist...
                        db.run(`UPDATE database SET value = (?) WHERE ID = (?)`, row.value + increase, ID);
                        db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {
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

    fetchObject: function(ID) {
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

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) { // Run if row not found...
                        insertRows()
                    }
                    else { // Run if row found...
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

    updateText: function(ID, text) {
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

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) {
                        insertRows()
                    }
                    else {
                        db.run(`UPDATE database SET text = (?) WHERE ID = (?)`, text, ID);
                        db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {
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

    fetchValue: function(ID) {

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

                db.get(`SELECT * FROM database WHERE ID = (?)`, ID, function(err, row) {
                    if (!row) { // Run if row not found...
                        insertRows()
                    }
                    else { // Run if row found...
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

    }
    /* Disabled
        fetchTop: function(column, amount) { // Column == value, or text

            const getInfo = new Promise((resolve) => {

                // Return Statements
                if (column.toUpperCase() !== 'VALUE'.toUpperCase() || column.toUpperCase() !== 'TEXT'.toUpperCase()) {
                    console.log('Quick.db Error w/ fetchTop: Column can only be (VALUE, TEXT).')
                    return error('Quick.db Error w/ fetchTop: Column can only be (VALUE, TEXT).')
                }

                if (isNaN(amount)) {
                    console.log('Quick.db Error w/ fetchTop: amount is not an integer.')
                    return error('Quick.db Error w/ fetchTop: amount is not an integer.')
                }


                let db;
                let response;

                function createDb() { // Create Database Chain
                    db = new sqlite3.Database('./database.sqlite', createTable)
                }

                function createTable() { // Create table if it doesn't exist
                    db.run("CREATE TABLE IF NOT EXISTS database (ID TEXT, value INTEGER, text TEXT)", checkIfCreated)
                }

                function checkIfCreated() { // Check if row exists w/ ID

                    db.get(`SELECT * FROM database ORDER BY (?) DESC LIMIT (?)`, column, amount, function(err, rows) {
                        if (!rows) { // Run if row not found...
                            insertRows()
                        }
                        else { // Run if row found...

                            function asyncFunction(item, callback) {
                                setTimeout(() => {
                                    console.log(`Parsed: ${item}`)
                                    callback();
                                }, 100)
                            }

                            let requests = rows.forEach(item => {
                                return new Promise((resolve) => {
                                    asyncFunction(item, resolve);
                                });
                            })

                            requests.then(() => {
                                response = rows
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

        }
    */

};
