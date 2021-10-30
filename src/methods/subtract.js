// Require Packages
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = function(db, params, options) {
  
  // Fetch entry
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  
  // If not found, create empty row
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID,json) VALUES (?,?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id); 
  }

  // Check if a target was supplied
  if (params.ops.target) {
    fetched = JSON.parse(fetched.json);
    let oldValue = get(fetched, params.ops.target);
    if (oldValue === undefined) oldValue = 0;
    else if (isNaN(oldValue)) throw new Error('Target is not a number.');
    params.data = set(fetched, params.ops.target, oldValue - params.data);
  } else {
    if (fetched.json === '{}') fetched.json = 0;
    else fetched.json = JSON.parse(fetched.json)
    if (isNaN(fetched.json)) throw new Error('Target is not a number.');
    params.data = parseFloat(fetched.json, 10) - parseFloat(params.data, 10);
  }
  
  // Stringify data
  params.data = JSON.stringify(params.data);

  // Update entry with new data
  db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(params.data, params.id);
  
  // Fetch & return new data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id).json;
  if (newData === '{}') return null;
  else {
    newData = JSON.parse(newData)
    return newData
  }
  
}
