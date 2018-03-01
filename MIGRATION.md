# Quick.db v5.x Migration Guide

**FULL DOCUMENTATION: [https://quickdb.js.org](https://quickdb.js.org)** 

| Old Syntax | New Syntax |
| ------ | ------ |
|.updateValue(ID, number) | .add(ID, number) & .subtract(ID, number) |
|.updateText(ID, text) | .set(ID, **data**) |
|.fetchObject(ID) | .fetch(ID) |
| --- | .push(ID, **data**) |
| --- | .delete(ID) |

**Data:** You can supply it any type, objects/numbers/text/arrays/etc., **they will all work.**

**Quick.db v5.x comes with even more features, you can learn about the documentation [here](https://www.npmjs.com/package/quick.db)!**


## Examples

**Old** - *Storing an object into the database*
```js
impossible
```

**New**
```js
db.set(`uniqueID`, { username: 'TrueXPixels', balance: 100 })
db.fetch(`uniqueID`).then(i => {
  console.log(typeof i) // 'object'
  console.log(i) // { username: 'TrueXPixels', balance: 100 }
})
```

---

**Old** - *Adding $100 to a user*
```js
db.updateValue(`userID`, 100)
db.fetchObject(`userID`).then(i => {
  console.log(i.value) // 100
})
```

**New**
```js
db.add(`userID`, 100)
db.fetch(`userID`).then(i => {
  console.log(typeof i) // 'number'
  console.log(i) // 100
})
```

---

**Old** - Setting the prefix of a server
```js
db.updateText(`guildID`, '!')
db.fetchObject(`guildID`).then(i => {
  console.log(i.text) // '!'
})
```

**New**
```js
db.set(`guildID`, '!')
db.fetch(`guildID`).then(i => {
  console.log(typeof i) // 'string'
  console.log(i) // '!'
})
```

---

**Old** - Setting an array of users
```js
db.setArray(`guildID`, ['user1', 'user2', 'user3', 'user4', 'user5'])
db.fetchArray(`guildID`).then(i => {
  console.log(i) // ['user1', 'user2', 'user3', 'user4', 'user5'] 
  // Note: Old version doesn't support multi-level arrays
})
```

**New**
```js
db.set(`guildID`, ['user1', 'user2', 'user3', 'user4', ['item1', 'item2', 'item3']])
db.fetch(`guildID`).then(i => {
  console.log(typeof i) // 'object'
  console.log(i) // ['user1', 'user2', 'user3', 'user4', ['item1', 'item2', 'item3']]
})
