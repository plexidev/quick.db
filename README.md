

Quick.db 
========

<div>
    <p>
        <a href="https://discord.io/plexidev"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
        <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>
        <a href="https://npm-stat.com/charts.html?package=quick.db"><img src="https://img.shields.io/badge/Downloads-15k+-brightgreen.svg"></a>
    </p>

| Website / Documentation | Support Discord | NPM Page |
| :---: | :---: | :---: |
| [https://quickdb.js.org](https://quickdb.js.org) | [https://discord.gg/8nrEqvP](https://discord.gg/8nrEqvP) | [https://www.npmjs.com/package/quick.db](https://www.npmjs.com/package/quick.db)

</div>

---

**Quick.db** is an **open-sourced** package meant to provide an easy way for beginners, and people of all levels to access & manage a database. **All data is stored persistently**, and comes with various extra features, such as a **queue system to prevent database locking**, and more.

**Want to provide feedback to help improve *Quick.db*?** [Click Here!](https://goo.gl/forms/KgjhQdWrztUfwHLB2)

---

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

### Installation

**Linux**
- `npm i quick.db`

**Windows**
1. Open CMD as Administrator
2. Run `npm -g install windows-build-tools node-gyp --save`
3. `npm i quick.db`

**Mac**
- We are currently looking for a way to install quick.db for this device

**Require Package**
```js
var db = require('quick.db')
```

---

### Full Documentation: [https://quickdb.js.org](https://quickdb.js.org)

#### What is quick.db?

> Quick.db is an easy to use database alternative, it was designed to be simple to let new users who are just getting into development not need to worry about large-scale databases.
It works by storing data to a set **ID**(key), then access that persistent data anytime through a .fetch() function.

> *You can think of it like a giant **persistent** JSON object, you can add new items to the object using .set(), & fetch items from the JSON object using .fetch(). The **ID** in this would be the name of the json object to fetch & set.*

---

*Over **239** public programs use **Quick.db** as a dependent!* [Source](https://github.com/TrueXPixels/quick.db/network/dependents)
