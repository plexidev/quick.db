module.exports = function (db, params, options) {
  db.backup(`backup-${Date.now()}.sqlite`)
    .then(() => {
      console.log("backup complete!");
    })
    .catch((err) => {
      console.log("backup failed:", err);
    });
};
