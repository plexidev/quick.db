// Require Package
const db = require('quick.db');

/*
# This file goes over using tables in Quick.db
# Tables are COMPLETELY OPTIONAL, not using them will just put everything to the main file
# 
# What they do:
# It allows for organizing databases, for example you can
# put all of your economy database entries in one table,
# and you can put all of the guild information in another table
#
# You can also view organized tables in the Database Manager
*/

// The regular "db" will always link to the main database

// Creating a new table
let guildInfo = new db.table('guildInfo'); // The string in db.table() is the name of the table

// guildInfo now works exactly the same as db, although it puts everything in a new table

/*
## SETTING IN TABLES
*/

// Setting the guildInfo table
guildInfo.set('serverOne', 'Plexi Development');
// The ID: 'serverOne' IN 'guildInfo' is now set to 'Plexi Development'

// Setting the normal database
db.set('serverOne', 'Quick.db');
// The ID 'serverOne' IN 'db' is now set to 'Quick.db');


/*
## FETCHING FROM TABLES
*/

// Fetching the guildInfo table
guildInfo.fetch('serverOne').then(i => console.log(i));
// -> 'Plexi Development'

// Fetching the db table
db.fetch('serverOne').then(i => console.log(i));
// -> 'Quick.db'