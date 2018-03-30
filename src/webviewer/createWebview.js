const app = require('express')(),
      server = require('http').createServer(app),
      io = require('socket.io')(server);

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

  
}