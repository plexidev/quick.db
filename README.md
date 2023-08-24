## ![Quick.db Logo](https://www.plexidev.org/quickdb.png)

> Need a powerful, low-cost VPS for hosting your applications & bots 24/7? Check out our partner, [Contabo](https://www.tkqlhce.com/click-8950879-15301134)! 🎉

**Auto Generated Docs** [docs](https://docs.plexidev.org/classes/index.QuickDB.html) <br>
**Guide** [Guide](https://quickdb.js.org/en/introduction/) <br>
**Support:** [discord.gg/plexidev](https://discord.gg/plexidev) <br>
**NPM:** [npmjs.com/quick.db](https://www.npmjs.com/package/quick.db)

Quick.db is an open-source package meant to provide an easy way for beginners and people of all levels to access & store data in a low to medium volume environment. All data is stored persistently via either [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3), [mysql2](https://www.npmjs.com/package/mysql2), [pg](https://www.npmjs.com/package/pg) or [mongoose](https://www.npmjs.com/package/mongoose) and comes way various other quality-of-life features.

-   **Persistent Storage** - Data doesn't disappear through restarts
-   **Multiple Drivers** - SQLite, MySQL, Postgres, Mongoose
-   **Works out of the box** - No need to set up a database server, all the data is stored locally in the same project
-   **Beginner Friendly** - Originally created for use in tutorials, the documentation is straightforward and jargon-free
-   & more...

**If you want to support me**

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/zelak)

## Installation

```bash
npm i quick.db
```

<br>
<details>
<summary>Mac Prerequisites</summary>
<br>

```bash
1. Install XCode
2. Run `npm i -g node-gyp` in terminal
3. Run `node-gyp --python /path/to/python` in terminal
```

</details>

> If you're having troubles installing, please follow [this troubleshooting guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).
> Windows users may need to do additional steps listed [here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

## Example With Sqlite (Default driver)

> **NOTE:** In order to use this driver, install `npm i better-sqlite3` separately.

```js
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder
// if you want to specify a path you can do so like this
// const db = new QuickDB({ filePath: "source/to/path/test.sqlite" });

(async () => {
    // Init the database, this is always needed!
    await db.init();

    // self calling async function just to get async
    // Setting an object in the database:
    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }

    // Getting an object from the database:
    await db.get("userInfo");
    // -> { difficulty: 'Easy' }

    // Getting an object property from the database:
    await db.get("userInfo.difficulty");
    // -> 'Easy'

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

> **NOTE:** In order to use this driver, install `npm i mysql2` separately.

```js
const { QuickDB, MySQLDriver } = require("quick.db");
(async () => {
    const mysqlDriver = new MySQLDriver({
        host: "localhost",
        user: "me",
        password: "secret",
        database: "my_db",
    });

    const db = new QuickDB({ driver: mysqlDriver });
    await db.init(); // Connects and setup the database
    // Now you can use quick.db as normal

    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }
})();
```

## Example With PostgresDriver

> **NOTE:** In order to use this driver, install `npm i pg` separately.

```js
const { QuickDB, PostgresDriver } = require("quick.db");
(async () => {
    const postgresDriver = new PostgresDriver({
        host: "localhost",
        user: "me",
        password: "secret",
        database: "my_db",
    });

    const db = new QuickDB({ driver: postgresDriver });
    await db.init(); // Connects and setup the database
    // Now you can use quick.db as normal

    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }
})();
```

## Example With MongoDriver

> **NOTE:** In order to use this driver, install `npm i mongoose` separately.

```js
const { QuickDB, MongoDriver } = require("quick.db");
(async () => {
    const mongoDriver = new MongoDriver("mongodb://localhost/quickdb");

    const db = new QuickDB({ driver: mongoDriver });
    await db.init(); // Connects and setup the database
    // Now you can use quick.db as normal

    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }

    await driver.close();
    // disconnect from the database
})();
```

## Example With JSONDriver

> **NOTE:** In order to use this driver, install `npm i write-file-atomic` separately.

```js
const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

// Init the database, this is always needed!
await db.init();
await db.set("userInfo", { difficulty: "Easy" });
```

## Example With MemoryDriver

> **Note:** In-memory database is not persistent and is suitable for temporary caching.

```js
const { QuickDB, MemoryDriver } = require("quick.db");
const memoryDriver = new MemoryDriver();
const db = new QuickDB({ driver: memoryDriver });

// Init the database, this is always needed!
await db.init();
await db.set("userInfo", { difficulty: "Easy" });
```
