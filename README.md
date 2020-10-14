## Quick.db

<a href="https://www.buymeacoffee.com/lorencerri" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

**Documentation:** [quickdb.js.org](https://quickdb.js.org) <br>
**Support:** [discord.gg/plexidev](https://discord.gg/plexidev) <br>
**NPM:** [npmjs.com/package/quick.db](https://www.npmjs.com/package/quick.db)

Quick.db is an open-source package meant to provide an easy way for beginners and people of all levels to access & store data in a low to medium volume environment. All data is stored persistently via [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) and comes way various other quality-of-life features.

- **Persistent Storage** - Data doesn't disappear through restarts
- **Works out of the box** - No need to set up a database server, all the data is stored locally in the same project
- **Beginner Friendly** - Originally created for use in tutorials, the documentation is straightforward and jargon-free
- & more...

## Example

[**Code Sandbox Demo**](https://codesandbox.io/s/quickdb-demo-7ti8z?file=/src/index.js)
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

## Installation

*If you're having troubles installing, please follow [this troubleshooting guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Linux & Windows**
- `npm i quick.db`

***Note:** Windows users may need to do additional steps [listed here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Mac**
1. **Install:** XCode
2. **Run:** `npm i -g node-gyp` in terminal
3. **Run:** `node-gyp --python /path/to/python2.7` (skip this step if you didn't install python 3.x)
4. **Run:** `npm i quick.db`
