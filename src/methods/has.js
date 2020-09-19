// Require Packages
const get = require('lodash/get');

module.exports = function(db, params, options) {
  
  // Fetch Entry
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = (?)`).get(params.id);
  if (!fetched) return false; // If empty, return false
  else fetched = JSON.parse(fetched.json);
  try { fetched = JSON.parse(fetched) } catch (e) {}
  
  // Check if target was supplied
  if (params.ops.target) fetched = get(fetched, params.ops.target); // Get prop using dot notation

  // Return boolean
  return (typeof fetched != 'undefined');
  
} // Papa bless, you here? I think we need update, push wasn't working.
