// Require Packages
const get = require('lodash.get');
const set = require('lodash.set');

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
    params.data = JSON.parse(params.data);
    if (typeof fetched !== 'object') throw new TypeError('Cannot push into a non object. 1');
    let oldArray = get(fetched, params.ops.target);
    if (oldArray === undefined) oldArray = [];
    else if (!Array.isArray(oldArray)) throw new TypeError('Target is not an array. 1');
    oldArray.push(params.data)
    params.data = set(fetched, params.ops.target, oldArray);
  } else {
    if (fetched.json === '{}') fetched.json = [];
    else fetched.json = JSON.parse(fetched.json);
    if (!Array.isArray(fetched.json)) throw new TypeError('Target is not an array. 2');
    fetched.json.push(params.data);
    params.data = fetched.json;
  }
  
  // Stringify data
  params.data = JSON.stringify(params.data);

  // Update entry with new data
  db.prepare(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`).run(params.data, params.id);
  
  // Fetch & return new data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id).json;
  if (newData === '{}') return null;
  else {
    return JSON.parse(newData)
  }
  
}