![Imgur](https://i.imgur.com/sP1Duq5.png)

<div>
  <p>
    <a href="https://discord.io/plexidev"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
    <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>
    <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db.svg?type=shield"/></a>
    <a href="https://npm-stat.com/charts.html?package=quick.db"><img src="https://img.shields.io/badge/Downloads-67k+-brightgreen.svg"></a>
    <a href="https://GitHub.com/Plexi-Development/quick.db/stargazers/"><img src="https://img.shields.io/github/stars/Plexi-Development/quick.db.svg?style=social&label=Star&maxAge=2592000"></a>
  </p>
    

| Website / Documentation | Discord Support *(3900+ Users)* | NPM Page |
| :---: | :---: | :---: |
| [quickdb.js.org](https://quickdb.js.org) | [discord.gg/plexidev](https://discord.gg/plexidev) | [npmjs.com/package/quick.db](https://www.npmjs.com/package/quick.db)

</div>

---

**Quick.db** is an **open-sourced** package meant to provide an easy way for beginners, and people of all levels to access & manage a database. **All data is stored persistently**, and comes with various extra features.

---

- **Persistent storage w/ no setup** *(Data doesn't disappear through restarts)*
- Beginner Friendly
- [Discord Support](https://discord.gg/plexidev)
- **Multiple tables support**
- **and more!**

---

![Imgur](https://i.imgur.com/nmROfQr.png)

> _All data in quick.db is stored **persistently** in a database. Here is an example of setting an object in the database, then fetching parts & the full object._

```js
const db = require('quick.db');

// Setting an object in the database:
db.set('userInfo', { difficulty: 'Easy' })
// -> { difficulty: 'Easy' }

// Pushing an element to an array (that doesn't exist yet) in an object:
db.push('userInfo.items', 'Sword')
// -> { difficulty: 'Easy', items: ['Sword'] }

// Adding to a number (that doesn't exist yet) in an object:
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }

// Repeating previous examples:
db.push('userInfo.items', 'Watch')
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }

// Fetching individual properties
db.get('userInfo.balance') // -> 1000
db.get('userInfo.items') // ['Sword', 'Watch']
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
1. **Install:** XCode
2. **Run:** `npm i -g node-gyp` in terminal
3. **Run:** `node-gyp --python /path/to/python2.7` (skip this step if you didn't install python 3.x)
4. **Run:** `npm i quick.db`

---

![Imgur](https://i.imgur.com/cFIeOmI.png)

> Quick.db is an easy to use database wrapper for better-sqlite3, it was designed to be simple to let new users who are just getting into development and don't want to worry about learning SQL just quite yet.

---

*Over **5020** open-source programs use **Quick.db** as a dependent!* [Source](https://github.com/Plexi-Development/quick.db/network/dependents)

---

![Imgur](https://i.imgur.com/ATgaVo4.png)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTrueXPixels%2Fquick.db?ref=badge_large)

---