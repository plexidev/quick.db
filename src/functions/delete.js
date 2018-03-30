module.exports = function(ID, db) {
    const getInfo = new Promise((resolve, error) => {

        let response;

        function createDb() {
            db.prepare("CREATE TABLE IF NOT EXISTS json (ID TEXT, json TEXT)").run();
            deleteRow();
        }

        function deleteRow() {
            db.prepare(`DELETE FROM json WHERE ID = (?)`).run(ID);
            response = true;
            returnDb();
        }

        function returnDb() {
            return resolve(response);
        }

        createDb();

    });
    return getInfo;
}