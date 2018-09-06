// Require Package
const db = require('../index.js'); // Equivalent to require('quick.db')

console.log('Running Tests...\n-----');

console.log('Setting & Fetching Numbers')
console.log(`Setting: ${db.set('intTest', 5)}`);
console.log(`Fetching: ${db.fetch('intTest')}`);

console.log('-----');

console.log('Setting & Fetching w/ Target');
console.log('Setting "bar" nested in ".foo.two":', db.set('nestedTest4', 'bar', { target: 'foo.two' }));
console.log('Fetching "bar" nested in ".foo.two":', db.fetch('nestedTest4.foo.two'));

console.log('-----');

console.log('Adding & Subtracting');
console.log('Adding 5:', db.add('addTest7', 5));
console.log('Adding 10 to ".foo.bar"', db.add('addTestTarget1', 10, { target: '.foo.bar' }));
console.log('Subtracting 1:', db.subtract('subTest', 1));
console.log('Subtracting 5 from ".foo.bar"', db.subtract('subTestTarget', 5, { target: '.foo.bar' }))

console.log('-----');

console.log('Pushing (Resets every minute)');
console.log('Pushing 5:', db.push('1' + new Date().getMinutes(), 5));
console.log('Pushing "pop" into ".fizz.buzz"', db.push('3' + new Date().getMinutes(), 'pop', { target: '.fizz.buzz' }));

const economy = new db.table('economy');
economy.set('userID.balance', 500);
console.log(economy.get('userID'));
console.log(economy.has('userID.balance'));
// -> { balance: 500 }

// Fetch All

economy.set('user2.balance', 5);
economy.set('user5.balance', 750);
economy.set('user7.balance', 100);
economy.set('user1.balance', -20);
economy.set('user3.balance', 500);
economy.set('user4.balance', 1000);
economy.set('user9.balance', 30);
economy.set('user8.balance', 20);
economy.set('user15.balance', 750);
economy.set('user11.balance', 100);

console.log('Fetching Sorted...');
console.log(economy.all({ sort: '.data' }));

console.log(economy.get('user11.bal'))