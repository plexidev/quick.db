module.exports = function(db, params, options) {
  
  // Fetch Entry
  var stmt = db.prepare(`SELECT * FROM ${options.table} WHERE ID IS NOT NULL`);
  let resp = [];
  stmt.iterate().forEach(row => {
    try {
      resp.push({
        ID: row.ID,
        data: JSON.parse(row.json)
      })
    } catch (e) {}
  })
  
  return resp;
}
