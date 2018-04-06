![Imgur](https://i.imgur.com/sP1Duq5.png)

<div>
  <p>
    <a href="https://discord.io/plexidev"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
    <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>
    <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db.svg?type=shield"/></a>
    <a href="https://npm-stat.com/charts.html?package=quick.db"><img src="https://img.shields.io/badge/Downloads-17.1k+-brightgreen.svg"></a>
    <a href="https://GitHub.com/truexpixels/quick.db/stargazers/"><img src="https://img.shields.io/github/stars/truexpixels/quick.db.svg?style=social&label=Star&maxAge=2592000"></a>
  </p>
    

| Website / Documentation | Discord Support *(1266+ Users)* | NPM Page |
| :---: | :---: | :---: |
| [quickdb.js.org](https://quickdb.js.org) | [discord.gg/8nrEqvP](https://discord.gg/8nrEqvP) | [npmjs.com/package/quick.db](https://www.npmjs.com/package/quick.db)

</div>

---

**Quick.db** is an **open-sourced** package meant to provide an easy way for beginners, and people of all levels to access & manage a database. **All data is stored persistently**, and comes with various extra features, such as a **queue system to prevent database locking**, and more.

**Want to provide feedback to help improve *Quick.db*?** [Click Here!](https://goo.gl/forms/KgjhQdWrztUfwHLB2)

---

![Imgur](https://i.imgur.com/qDSD8ni.png)
- **Persistent storage w/ no setup** *(Data doesn't disappear through restarts)*
- [Beginners Friendly](https://quickdb.js.org/examples/beginner/storing-updating-and-fetching-numbers.html)
- [Built-in Webviewer](https://quickdb-latest.glitch.me/data/?password=pass111)
- [Discord Support](https://discord.io/plexidev)
- Built-in queue system **no database locking.**
- **Multiple table support**

---

![Imgur](https://i.imgur.com/nmROfQr.png)

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

![Imgur](https://i.imgur.com/t7rqmM7.png)

**Linux**
- `npm i quick.db`

**Windows**
1. **Run:** `npm -g --add-python-to-path install windows-build-tools node-gyp` in **powershell as administrator**
2. **Restart** CMD prompt windows (*Close & Reopen*)
3. **Run:** `npm i quick.db`

**Mac**
- We are currently looking for a way to install quick.db for this device

**Require Package & Create Webviewer**
```js
const db = require('quick.db');
db.createWebview('password', PORT);
```

---

![Imgur](https://i.imgur.com/cFIeOmI.png)

> Quick.db is an easy to use database alternative, it was designed to be simple to let new users who are just getting into development not need to worry about large-scale databases.
It works by storing data to a set **ID**(key), then access that persistent data anytime through a .fetch() function.

> *You can think of it like a giant **persistent** JSON object, you can add new items to the object using .set(), & fetch items from the JSON object using .fetch(). The **ID** in this would be the name of the json object to fetch & set.*

---

*Over **247** open-source programs use **Quick.db** as a dependent!* [Source](https://github.com/TrueXPixels/quick.db/network/dependents)

---

![Imgur](https://i.imgur.com/ATgaVo4.png)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db?ref=badge_large)
