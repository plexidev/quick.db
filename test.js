const db = require('./index.js');
 
let number = 100;

db.set('uniqueID', number)
db.fetch('uniqueID').then(i => console.log(i))

db.add('uniqueID', 'cheese')
db.fetch('uniqueID').then(i => console.log(i))

db.subtract('uniqueID', 1000.10)
db.fetch('uniqueID').then(i => {
  console.log(i)
  console.log(typeof i)
})