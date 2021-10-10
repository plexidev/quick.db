module.exports = function(db, params, options) {
  
  // Delete all Rows
  let fetched = db.prepare(`DELETE FROM ${options.table}`).run();
  if(!fetched) return null;
  
  // Return Amount of Rows Deleted
  return fetched.changes;
  
}
