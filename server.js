// Require Package
const db = require('./index.js');

// Create Webviewer
db.createWebview('pass111', process.env.PORT);

// Activate New Table
let db2 = new db.table('hi')

// Update New Table
db2.set('test', 2).then(i => console.log('newTable set:', i));

// Fetch New Table
db2.fetch('test').then(i => console.log('newTable fetch:', i));

// Fetch Old Table
db.fetch('test').then(i => console.log('oldTable fetch:', i));

// Push New Table
db2.push('test1', 'hi').then(i => console.log('newTable push:', i));

// Push Old Table
db.push('test', 'what').then(i => console.log('oldTable push:', i));