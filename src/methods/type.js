// Require Packages
const get = require('lodash/get');

module.exports = function(db, params, options) {
  
  // Fetch Entry
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  if (!fetched) return null; // If empty, return null
  fetched = JSON.parse(fetched.json)
  try { fetched = JSON.parse(fetched) } catch (e) {}
  
  // Check if target was supplied
  if (params.ops.target) fetched = get(fetched, params.ops.target); // Get prop using dot notation
  
  // Return data
  return typeof fetched;
  
}
