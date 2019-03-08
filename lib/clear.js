module.exports = function (db, params, options) {
  db.prepare(`DELETE FROM ${options.table}`).run();
  return true;
};
