const util = require('util'),
    _ = require('lodash/object');

module.exports = function(ID, data, options, db) {
    const getInfo = new Promise((resolve, error) => {

        if (typeof data !== 'number') return console.log('Error: .add() data is not a number.');

        // Configure Options
        if (options) {
            options = {
                target: options.target || null
            }
        }

        let response;

        function createDb() {
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
            return resolve(response);
        }

        createDb();

    });
    return getInfo;
}