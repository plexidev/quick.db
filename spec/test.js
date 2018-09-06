// Require Package
const db = require('../index.js'); 
db.set('test3', [ 2 ]);
console.log(db.push('test3', 5))
db.set("test", {ree: {reee: 5}});

console.log(db.fetch("test"))
console.log(db.fetch("test.ree"))
console.log(db.fetch("test.ree.reee"))
console.log(db.add("test.ree.reee", 50).ree.reee)