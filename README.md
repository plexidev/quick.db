![Quick.db](https://i.plexidev.org/R7rG)

<div>
  <p>
    <a href="https://www.patreon.com/bePatron?u=806427" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="85"></a>
    <a href="https://discord.gg/plexidev"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
    <a href="https://GitHub.com/Plexi-Development/quick.db/stargazers/"><img src="https://img.shields.io/github/stars/Plexi-Development/quick.db.svg?style=social&label=Star"></a>
  </p>
    

| Website / Documentation | Discord Support *(25000+ Users)* | NPM Page |
| :---: | :---: | :---: |
| [quickdb.js.org](https://quickdb.plexidev.org) | [discord.gg/plexidev](https://discord.gg/plexidev) | [npmjs.com/package/quick.db](https://www.npmjs.com/package/quick.db)

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

![Examples](https://i.plexidev.org/Vi3L)

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

![Installation](https://i.plexidev.org/P3DV)

*If you're having troubles installing, please follow [this troubleshooting guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Linux & Windows**
- `npm i quick.db`

***Note:** Windows users may need to do additional steps [listed here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Mac**
1. **Install:** XCode
2. **Run:** `npm i -g node-gyp` in terminal
3. **Run:** `node-gyp --python /path/to/python2.7` (skip this step if you didn't install python 3.x)
4. **Run:** `npm i quick.db`

---

![What is quick.db?](https://i.plexidev.org/ced4)

> Quick.db is an easy to use database wrapper for better-sqlite3, it was designed to be simple to let new users who are just getting into development and don't want to worry about learning SQL just quite yet.

---

*Over **16,000** open-source programs use **Quick.db** as a dependent!* [Source](https://github.com/Plexi-Development/quick.db/network/dependents)

---
