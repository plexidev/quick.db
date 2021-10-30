module.exports = function(db, params, options) {
  
  // Fetch Entry
  var stmt = db.prepare(`SELECT * FROM ${options.table} WHERE ID IS NOT NULL`);
  let resp = [];
  for (var row of stmt.iterate()) {
    try {
      let data = JSON.parse(row.json)
      resp.push({
        ID: row.ID,
        data
      })
    } catch (e) {}
  }

  return resp;
  
}
