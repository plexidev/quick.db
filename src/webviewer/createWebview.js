const app = require('express')(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  Database = require('better-sqlite3'),
  fetch = require('./../functions/fetch.js'),
  fetchAll = require('./../functions/fetchAll.js'),
  push = require('./../functions/push.js'),
  tables = require('./../functions/tables.js');

/*
 * NOTEPAD:
 *
 * - Need to call queue.js file using require
 * - ^ Don't do that it creates a circular require path (infinite loop)
 *
 *
 */

module.exports = function(password, port, suburl) {
  // Verify Data
  if (!password) return console.log('Invalid Password');
  if (isNaN(port)) return console.log('Invalid Port');
  // Routing
  // If no suburl
  if (!suburl) {
    app.get("/", function(request, response) {
      response.sendFile(__dirname + '/index.html')
    })

    app.get("/data", function(request, response) {
      response.sendFile(__dirname + '/data.html')
    })
  } else {
    // If suburl is a string
    if (typeof suburl === 'string') {
      app.get(`/${suburl}/`, function(request, response) {
        response.sendFile(__dirname + '/index.html')
      })

      app.get(`/${suburl}/data`, function(request, response) {
        response.sendFile(__dirname + '/data.html')
      })
    } else {
      // If it's not a string, convert suburl to a string
      let suburlString = String(suburl)
      app.get(`/${suburlString}/`, function(request, response) {
        response.sendFile(__dirname + '/index.html')
      })

      app.get(`/${suburl}/data`, function(request, response) {
        response.sendFile(__dirname + '/data.html')
      })
    };
  };

  // Listening
  server.listen(port, function() {
    console.log(`Quick.db WebViewer: Listening to port ${port}`)
  });

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
        push(`WEBVIEW_ACTIVE_SOCKETS`, socket.id, undefined, db)
      }
    })

    socket.on('requestData', function(tableName) {
      let db = new Database('./json.sqlite');
      fetch(`WEBVIEW_ACTIVE_SOCKETS`, {}, db).then(activeSockets => {
        if (activeSockets === null) return;
        if (!activeSockets.includes(socket.id)) return;
        let db = new Database('./json.sqlite');
        fetchAll({
          table: tableName
        }, db).then(i => {
          tables(db).then(o => {
            i.unshift(o);
            socket.emit('recievedData', i);
            db.close();
          });
        });
      })
    })

  })


}