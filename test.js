const db = require("./index.js");

const express = require('express')
const app = express();
const server = require("http").createServer(app);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

db.createWebview("1234", 8443, "custom", {"server": server, "request": app});
//It will ignore the port passed in if you use the option for the server