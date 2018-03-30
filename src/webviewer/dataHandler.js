const Database = require('better-sqlite3'),
      fetch = require('./../functions/fetch.js');

module.exports = {
  createHandler: function(io) {
    
  },
  emitData: function(data) {
    console.log(data)
    fetch(`ACTIVE_WEBVIEW_TOKEN_SOCKETS`).then(i => {
      console.log(i)
    })
  }
}