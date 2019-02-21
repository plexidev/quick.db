module.exports = function(db, params, options) {
   let fetched = db.prepare(`SELECT * FROM ${options.table}`).get();
   if (!fetched) return false
   else {
     db.prepare(`DELETE FROM ${options.table};`).run();
     return true;
   }
}
