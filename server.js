// Fetch Package
const db = require('./index.js')
console.log('Running...');
// Create Webview
db.createWebview('pass111', process.env.PORT); 
db.set('userInfo_184598052747739136', { username: 'Le Dieu Revolx', balance: 500 })
db.set('userInfo_175997512782446593', { username: 'Morfixx', balance: 700 })
db.set('userInfo_144645791145918464', { username: 'TrueXPixels', balance: 100 })
db.set('userInfo_264378908756017154', { username: 'ExtasyMonst4', balance: 900 })
db.startsWith('userInfo', { sort: '.data.balance' }).then(i => console.log(i)) 