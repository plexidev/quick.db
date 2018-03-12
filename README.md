

Quick.db 
========

<div align="center">
    <p>
        <a href="https://discord.io/plexidev"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
        <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>       
    </p>
</div> 

**Note:** This package is under development and will be updated frequently.

This package is meant to provide an easy way to create and use a database, **all data is stored persistently**, and comes with a **queue system to prevent database locking**.

*Over **180** public programs use **Quick.db** as a dependent!* [Source](https://github.com/TrueXPixels/quick.db/network/dependents)

**Want to provide feedback to help improve *Quick.db*?** [Click Here!](https://goo.gl/forms/KgjhQdWrztUfwHLB2)

### Example

> *All data in quick.db is stored **persistently** in a database. Here is an example of setting an object in the database, then fetching parts & the full object.*

```js
const db = require('quick.db');

// Setting the FULL object
db.set('userInfo', { part1: 'Hello', part2: 'World!' }).then( i => console.log(i))
// -> { part1: 'Hello', part2: 'World!' }

// Fetching only PARTS of the object
db.fetch('userInfo', { target: '.part1' }).then( i => console.log(i)) 
// -> 'Hello'

db.fetch('userInfo', { target: '.part2' }).then( i => console.log(i)) 
// -> 'World!'

// Fetching the FULL object
db.fetch('userInfo').then( i => console.log(i))
// -> { part1: 'Hello', part2: 'World!' }
```

---

**Installation**
```
npm install quick.db
```


**Require Package**
```
var db = require('quick.db')
```

*[v3.x/v4.x to v5.x Migration Guide](https://github.com/TrueXPixels/quick.db/blob/quickdb/MIGRATION.md)*

---

### Full Documentation: [https://quickdb.js.org](https://quickdb.js.org)

#### What is quick.db?

> Quick.db is an easy to use database alternative, it was designed to be simple to let new users who are just getting into development not need to worry about large-scale databases.
It works by storing data to a set **ID**(key), then access that persistent data anytime through a .fetch() function.

> *You can think of it like a giant **persistent** JSON object, you can add new items to the object using .set(), & fetch items from the JSON object using .fetch(). The **ID** in this would be the name of the json object to fetch & set.*