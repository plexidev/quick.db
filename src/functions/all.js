module.exports = function(db) {
    const getInfo = new Promise((resolve, error) => {

        let response = [];

        function createDb() {
            db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
            fetchAll();
        }

        function fetchAll() {
            let resp = db.prepare(`SELECT * FROM json`).all();
            resp.forEach(function(entry){
              response.push({ ID: entry.ID, data: JSON.parse(entry.json) })
            })
            returnDb();
        }

        function returnDb() {
            return resolve(response);
        }

        createDb();

    });
    return getInfo;
}