module.exports = function(db, params, options) {
  
  // Fetch Entry
  var stmt = db.prepare(`SELECT * FROM ${options.table} WHERE ID IS NOT NULL`);
  let resp = new Map();
  for (var row of stmt.iterate()) {
    try {
      resp.set(row.ID, JSON.parse(row.json));
    } catch (e) {};
  };
  
  return resp;
  
};