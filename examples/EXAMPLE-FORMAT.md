*If you want to modify an existing example, please do so by sending a pull request*

**Template:**
*(Not required)*
```js
// Require Package
const db = require('quick.db');

/**
* Example Title:
* Topics Covered:
* Any Information:
/





```
**Example:**
```js
// Require Package
const db = require('quick.db');

/** 
/ Usage: db.add(ID, number)
/ This adds the specified value(number) to an existing number.
/ @param ID = This is the target ID you are modifying
/ @param number = This is the value you would like to add to the existing database entry
*/

// This is an example of adding to a user's balance, so we can make the ID dynamic
let ID = 'userBalance_ID';

// This is the amount we will be adding
let amount = 500;

// Format: db.add(<ID>, <Amount(Number)>)
db.add(ID, amount); // This will add 500 to the ID in the database, it also returns a callback

// Callback: Update Item
db.add(ID, amount).then(newItem => { // You can also use async & await

  console.log(newItem); // This will return the update item
  // -> 500
  console.log(typeof newItem);
  // -> 'number'
  
})
```
