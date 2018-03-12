const db = require('./index.js');

let ID = '12345';

for (var i = 0; i < 10000; i++) {
  db.push(ID, { username: 'TrueXPixels', money: 100 })
}
