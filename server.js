/*
# server.js & json.sqlite
# allow for shared testing
#
# These files are ignored when pushing to NPM
#
*/

// Require Package
const db = require('./index.js');

// Create Webviewer
db.createWebview('pass111', process.env.PORT);

// Activate New Table
let economy = new db.table('hi')

// Update New Table
economy.set('test', 2).then(i => console.log('newTable set:', i));

// Update Old Table
db.set('test', 4).then(i => console.log('oldTable set:', i));

// Fetch New Table
economy.fetch('test').then(i => console.log('newTable fetch:', i));

// Fetch Old Table
db.fetch('test').then(i => console.log('oldTable fetch:', i));

// Push New Table
economy.push('myArray', 'hi').then(i => console.log('newTable push:', i.length));

// Push Old Table
db.push('myArray', 'what').then(i => console.log('oldTable push:', i.length));