// Require Package
const db = require('quick.db');

/*
* This example covers fetching database entries
* Quick.db is entry & ID based, which means to access or modify an entry, all you need is the ID of the entry
* 
* .fetch(ID, options)
* @param ID = This is the ID of the entry we are going to be fetching
* @param options = These are the options that are available
* @returns Promise<entry> = .fetch() returns an entry in promise form
*/

// Setting an entry - You can find examples of this in ./examples/
let ID = '175997512782446593'; // We can make IDs dynamic, so based on the ID of the user, it will return a different database entry
let entry = { tagline: `Hello World!` }; // This is the entry we will be setting into the database to fetch

db.set(`userInfo_${ID}`, entry);

// Now, { tagline: `Hello World!` } is set into the database with the ID of 'userInfo_175997512782446593'

/*
* Fetching an entry from the database
* Since everything in quick.db uses IDs, we can fetch the entry using the ID we assigned to it
*/

// We can use the same ID as before to fetch the entry
db.fetch(`userInfo_${ID}`).then(res => { // The entry is now stored in the `res` variable

  console.log(res);
  // -> { tagline: 'Hello World!' }
  
  console.log(typeof res);
  // -> 'object'

})

/*
* The 'OPTIONS' portion
* .fetch() has the option of 'target', which can get the data from inside an object stored in an entry
*/

db.fetch(`userInfo_${ID}`, { target: '.tagline' }).then(res => {
  // Instead of res holding the entire object, it now only holds the .tagline portion of it
  
  console.log(res);
  // -> 'Hello World!'
  
  console.log(typeof res);
  // -> 'string'

})
