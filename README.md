## Quick.db
> v9.0.x introduces a variety of breaking changes from v7.1.3, you can view a migration guide [here](https://quickdb.js.org/overview/migration-guide).

**Documentation:** [quickdb.js.org](https://quickdb.js.org) <br>
**Support:** [discord.gg/plexidev](https://discord.gg/plexidev) <br>
**NPM:** [npmjs.com/quick.db](https://www.npmjs.com/package/quick.db)

Quick.db is an open-source package meant to provide an easy way for beginners and people of all levels to access & store data in a low to medium volume environment. All data is stored persistently via either [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) or [promise-mysql](https://www.npmjs.com/package/promise-mysql) and comes way various other quality-of-life features.

- **Persistent Storage** - Data doesn't disappear through restarts
- **Multiple Drivers** - You can use either better-sqlite3 or promise-mysql
- **Works out of the box** - No need to set up a database server, all the data is stored locally in the same project
- **Beginner Friendly** - Originally created for use in tutorials, the documentation is straightforward and jargon-free
- & more...

## Installation

<details>
<summary>Mac Prerequisites</summary>
<br>

```bash
1. Install XCode
2. Run `npm i -g node-gyp` in terminal
3. Run `node-gyp --python /path/to/python` in terminal
```
    
</details>

```bash
npm i quick.db better-sqlite3 # (Default) Local SQLite3 File
npm i quick.db promise-mysql # (Alternative) MySQL Server Connection
```

> If you're having troubles installing, please follow [this troubleshooting guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).
> Windows users may need to do additional steps listed [here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

## Example

```js
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder
// if you want to specify a path you can do so like this
// const db = QuickDB({ filePath: "source/to/path/test.sqlite" });

(async () => {
    // self calling async function just to get async
    // Setting an object in the database:
    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }

    // Pushing an element to an array (that doesn't exist yet) in an object:
    await db.push("userInfo.items", "Sword");
    // -> { difficulty: 'Easy', items: ['Sword'] }

    // Adding to a number (that doesn't exist yet) in an object:
    await db.add("userInfo.balance", 500);
    // -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }

    // Repeating previous examples:
    await db.push("userInfo.items", "Watch");
    // -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
    await db.add("userInfo.balance", 500);
    // -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }

    // Fetching individual properties
    await db.get("userInfo.balance"); // -> 1000
    await db.get("userInfo.items"); // ['Sword', 'Watch']
})();
```

## Example With MySQLDriver

> **NOTE:** In order to use this driver, install `npm i promise-mysql` separately.

```js
const { QuickDB, MySQLDriver } = require("quick.db");
(async () => {
    const mysqlDriver = new MySQLDriver({
        host     : 'localhost',
        user     : 'me',
        password : 'secret',
        database : 'my_db'
    });

    await mysqlDriver.connect(); // connect to the database **this is important**

    const db = new QuickDB({ driver: mysqlDriver });
    // Now you can use quick.db as normal

    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }
})();
```

## Changes in 9.x.x

-   Added drivers and file path option
    Now when using Quick.db you can choose the driver you want (SqliteDriver or MySQLDriver included for now)

-   Changed the api to use async/await
    why? because now with different drivers some of them need async so may as well put everything async

-   Changed quickdb to be a class so the initialization part is a bit different

-   Changed function subtract to sub. To match the length of add

-   Added deleteAll function to whipe the entire database

```js
db.deleteAll();
```

-   Added pull function to remove from an array

```js
// db contains key: "test" -> ["nice"]
db.pull("test", "nice"); // will remove from array
// multiple values can be removed by using an array
db.pull("test", ["nice", "other"]);
// if you are using objects inside the array you can pass your own function to filter them
// db contains key: "test" -> [{id: "nice"}]
db.pull("test", (e) => e.id == "nice");
```

-   Changed how add and sub works
    Now they will both try to parse the current value if it is not a number so setting "100" as a string for example will still work
