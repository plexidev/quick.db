# Quick.db v5.x Migration Guide

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
  console.log(i) // '!'
})
