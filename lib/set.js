// Require Packages
const set = require('lodash.set');

module.exports = function(db, params, options) {
  if (typeof fetched === 'object' && params.ops.target) {
    params.data = JSON.parse(params.data);
    params.data = set(fetched, params.ops.target, params.data);
  } else if (params.ops.target) throw new TypeError('Cannot target a non-object.');
  params.data = JSON.stringify(params.data);
  // Insert if the entry does not exist or update if entry exists already in the database
  db.prepare(`INSERT OR REPLACE INTO ${options.table} (ID, json) VALUES(?, ?);`).run(params.id, params.data);
  // Fetch & return new data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id).json;
  if (newData === '{}') return null;
  else {
    newData = JSON.parse(newData)
    try { newData = JSON.parse(newData) } catch (e) {}
    return newData
  }
}
