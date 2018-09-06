// Require Packages
const unset = require('lodash.unset');

module.exports = function(db, params, options) {
  
  // Fetch Entry
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  if (!fetched) return false; // If empty, return null
  else fetched = fetched.json;
  
  // Check if the user wants to delete a prop inside an object
  if (typeof fetched === 'object' && params.ops.target) return unset(fetched, params.ops.target);  
  else if (params.ops.target) throw new TypeError('Cannot target a non-object.');
  else console.log(db.prepare(`DELETE FROM ${options.table} WHERE ID = (?)`).run(params.id));
  
  // Resolve
  return true;
  
}