// Require Package
const db = require('../index.js');

/** db.add(ID, number)
/ This adds the specified value(number) to an existing number.
/ @param ID = This is the target ID you are modifying
/ @param number = This is the value you would like to add to the existing database entry
*/

let ID = 'userBalance_ID'; // This is an example of adding to a user's balance, so we can make the ID dynamic
let amount = 500; // This is the amount we will be adding

// Format: db.add(<ID>, <Amount(Number)>)
db.add(ID, amount); // This will add 500 to the ID in the database, it also returns a callback

// Callback: Update Item
db.add(ID, amount).then(newItem => { // You can also use async & await
  console.log(newItem); // This will return the update item
  // -> 500
  console.log(typeof newItem);
  // -> number
})
