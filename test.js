const db = require('./index.js');

let ID = '1';

db.delete(ID).then(i => console.log('Deleting...', i, typeof i));
db.set(ID, 'World', { target: 'Hello' }).then(i => console.log('Setting...', i, typeof i));

db.add(ID, 5, { target: 'Number' }).then(i => console.log('Adding...', i, typeof i));