// Require Package
const db = require('../index.js'); // Equivalent to require('quick.db')

// Setting an object in the database:
console.log(db.set('userInfo', { difficulty: 'Easy' }))
// -> { difficulty: 'Easy' }
 
// Pushing an element to an array (that doesn't exist yet) in an object:
console.log(db.push('userInfo.items', 'Sword'))
// -> { difficulty: 'Easy', items: ['Sword'] }
 
// Adding to a number (that doesn't exist yet) in an object:
console.log(db.add('userInfo.balance', 500))
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }
 
// Repeating previous examples:
console.log(db.push('userInfo.items', 'Watch'))
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
console.log(db.add('userInfo.balance', 500))
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }
 
// Fetching individual properties
console.log(db.get('userInfo.balance')) // -> 1000
console.log(db.get('userInfo.items')) // ['Sword', 'Watch']