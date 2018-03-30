const app = require('express')(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  Database = require('better-sqlite3'),
  fetch = require('./../functions/fetch.js'),
  fetchAll = require('./../functions/all.js'),
  push = require('./../functions/push.js');

/*
 * NOTEPAD:
 *
 * - Need to call queue.js file using require
 *
 *
 *
 */

module.exports = {
  emitData: function(data) {
    let db = new Database('./json.sqlite');
    fetch(`WEBVIEW_ACTIVE_SOCKETS`, {}, db).then(activeSockets => {
      if (activeSockets === null) return;
      console.log(activeSockets, data)
    })
  },
  createWebview: function(password, port) {
    console.log('hi');
    // Verify Data
    if (!password) return console.log('Invalid Password');
    if (isNaN(port)) return console.log('Invalid Port');

    // Listening
    server.listen(port, function() {
      console.log(`Quick.db WebViewer: Listening to port ${port}`)
    });

    // Routing  
    app.get("/", function(request, response) {
      response.sendFile(__dirname + '/index.html')
    })

    app.get("/data", function(request, response) {
      response.sendFile(__dirname + '/data.html')
    })

    io.on('connection', function(socket) {
      console.log('Connection Recieved...');

      socket.on('emitPassword', function(pass) {
        if (password !== pass) {
          console.log(`Socket entered wrong password: ${pass}`);
          socket.emit('respPassword', false);
        } else {
          console.log(`Socket entered correct password: ${pass}`);
          socket.emit('respPassword', true);
          let db = new Database('./json.sqlite');
          push(`WEBVIEW_ACTIVE_SOCKETS`, socket.id, undefined, db).then(i => console.log('Sockets', i));
        }
      })

      socket.on('requestData', function() {
        let db = new Database('./json.sqlite');
        fetch(`WEBVIEW_ACTIVE_SOCKETS`, {}, db).then(activeSockets => {
          if (activeSockets === null) return;
          if (!activeSockets.includes(socket.id)) return;
          let db = new Database('./json.sqlite');
          fetchAll(db).then(i => {
            socket.emit('recievedData', i)
            db.close();
          });
        })
      })

    })

  }
}