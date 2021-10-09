module.exports = function(db, params) {
  
  // Delete all Rows
  let fetched = db.prepare(`DELETE FROM ${options.table}`).run();
  
   // Return Amount of Rows Deleted
  return fetched;
  
}
