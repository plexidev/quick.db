// Fetch Package
const db = require('./index.js')
console.log('Running...');
// Create Webview
db.createWebview('pass111', process.env.PORT);

function main() {
 
  db.set(`userInfo_144645791145918464`, { username: 'TrueXPixels', balance: 400 })
  db.set(`userInfo_264378908756017154`, { username: 'ExtasyMonst4', balance: 400 })
  db.set(`guildItems_343572980351107077`, [ 'Iron', 'Steel', 'Copper' ])
  db.set(`globalBalance`, 400250)
  db.set(`guildPinnedChannels_343572980351107077`, [ '#truexpixels-lounge', '#announcements' ])
  db.set(`userInfo_175997512782446593`, { username: 'Morfixx', balance: 400 })
  db.set(`userInfo_184598052747739136`, { username: 'Lê Dieu Revolx', balance: 400 })
  db.set(`guildItems_385322982414608652`, [ 'Bronze', 'Gold', 'Crystal' ])
  
}

db.add(`id`, 5)