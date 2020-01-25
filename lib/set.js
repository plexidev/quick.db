// Require Packages
const set = require('lodash/set');

module.exports = function(db, params, options) {
  
  // Fetch entry
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  
  // If not found, create empty row
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID,json) VALUES (?,?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  }
  
  // Parse fetched
  fetched = JSON.parse(fetched.json);
  try { fetched = JSON.parse(fetched) } catch (e) {}

  // Check if a target was supplied
  if (typeof fetched === 'object' && params.ops.target) {
    params.data = JSON.parse(params.data);
    params.data = set(fetched, params.ops.target, params.data);
  } else if (params.ops.target) throw new TypeError('Cannot target a non-object.');

  // Stringify data
  params.data = JSON.stringify(params.data);

  // Update entry with new data
  db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(params.data, params.id);
  
  // Fetch & return new data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id).json;
  if (newData === '{}') return null;
  else {
    newData = JSON.parse(newData)
    try { newData = JSON.parse(newData) } catch (e) {}
    return newData
  }
  
}
