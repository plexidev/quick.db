const app = require('express')(),
      server = require('http').createServer(app),
      io = require('socket.io')(server);
let   activeSockets = [];

module.exports = function(password, port) {
  
  // Verify Data
  if (!password) return console.log('Invalid Password');
  if (isNaN(port)) return console.log('Invalid Port');
  
  // Listening
  server.listen(port, function(){
    console.log(`Quick.db WebViewer: Listening to port ${port}`)
  });
  
  // Routing  
  app.get("/", function(request, response) {
      response.sendFile(__dirname + '/index.html')
  })
  
  app.get("/data", function(request, response) {
      response.sendFile(__dirname + '/data.html')
  })
  
  io.on('connection', function(socket){
    console.log('Connection Recieved...');
    
    socket.on('emitPassword', function(pass){
      if (password !== pass) {
        console.log(`Socket entered wrong password: pass`);
        socket.emit('respPassword', false);
      }
      else {
        console.log(`Socket entered correct password: pass`);
        socket.emit('respPassword', true);
        activeSockets.push(socket.id);
      }
    })
    
  })

  
}