module.exports = function (db, params, options) {
  const name = options.name ? options.name : Date.now();
  db.backup(`backup-${name}.sqlite`)
    .then(() => {
      console.log("backup complete!");
    })
    .catch((err) => {
      console.log("backup failed:", err);
    });
};
