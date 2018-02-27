

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

*Over **133** public programs use **Quick.db** as a dependent!* [Source](https://github.com/TrueXPixels/quick.db/network/dependents)

**Want to provide feedback to help improve *Quick.db*?** [Click Here!](https://goo.gl/forms/KgjhQdWrztUfwHLB2)

---

**Installation**
```
npm install quick.db
```


**Require Package**
```
var db = require('quick.db')
```

*[v3.x/v4.x to v5.x Migration Guide](https://github.com/TrueXPixels/quick.db/blob/master/MIGRATION.md)*

---

## Table Of Contents
**[.set(uniqueID, data)](#set)** - *Sets data to the uniqueID you supply, data can be anything: objects, arrays, strings, numbers, etc.*

**[.fetch(uniqueID)](#fetch)** - *Fetches the data using the uniqueID you assigned earlier*

**[.delete(uniqueID)](#delete)** - *Deletes an object using the uniqueID you assigned earlier*

**[.push(uniqueID, data)](#push)** - *Pushes a new item to an __ARRAY__, if target is not an array, it supplys a non-breaking error*

**[.add(uniqueID, number)](#add)** - *Adds the specified amount to a __NUMBER__, if target is not a number, it supplys a non-breaking error*

**[.subtract(uniqueID, number)](#subtract)** - *Subtracts the specified amount to a __NUMBER__, if target is not a number, it supplys a non-breaking error*

**[Frequently Asked Questions](#FAQ)** - *Some common questions, errors, etc.*

**[Projects Using Quick.db](#projects)** - *Lists a few projects that use quick.db*

## Documentation

<a name="set"></a>**.set(ID, data)** - *Assigns the given data to the given ID*

*> Optionally returns the set data*
```js
db.set('uniqueID', { username: 'TrueXPixels', money: 400 }).then(i => {
  console.log(typeof i) // object
  console.log(i) // { username: 'TrueXPixels', money: 400 }
  console.log(i.money) // 400
})

db.set('uniqueID', 'Hello World!').then(i => {// Sets Database
  console.log(typeof i) // string
  console.log(i) // 'Hello World!'
})

db.set('uniqueID', 42).then(i => {
  console.log(typeof i) // number
  console.log(i) // 42
})

db.set('uniqueID', ['Hello World!', 10, ['What?', 'Another Array!']]).then(i => {
  console.log(typeof i) // object
  console.log(i) // ['Hello World!', 10, ['What?', 'Another Array!']]
  console.log(i[2]) // ['What?', 'Another Array!']
})
```

---

<a name="fetch"></a>**.fetch(ID)** - *Fetches the data from the given ID*

*> Returns NULL if no data*
```js
db.set('TrueXPixelsID', 'Hello World!')
db.fetch('TrueXPixelsID').then(i => {
  console.log(typeof i) // string
  console.log(i) // 'Hello World'
})

db.set('MorfixxID', 10)
db.fetch('MorfixxID').then(i => {
  console.log(typeof i) // number
  console.log(i) // 10
})

db.set('RevolxID', ['Coal', 'Silver', 'Wood'])
db.fetch('RevolxID').then(i => {
  console.log(typeof i) // object
  console.log(i.length) // 3
  console.log(i) // ['Coal', 'Silver', 'Wood']
  console.log(i[2]) // 'Wood'
})

db.set('ExtasyID', { username: 'main', money: 100, items: ['Wood', 'Stone']})
db.fetch('ExtasyID').then(i => {
  console.log(typeof i) // object
  console.log(i) // { username: 'main', money: 100, items: ['Wood', 'Stone']}
  console.log(i.username) // 'main'
  console.log(i.items) // ['Wood', 'Stone']
  console.log(i.items[0]) // 'Wood'
})
```

---

<a name="delete"></a>**.delete(ID)** - *Deletes the specified ID & data from the database*

*> Returns a boolean, based on if it deleted the object or not*
```js
db.set('uniqueID', 'Hello World!')
db.fetch('uniqueID').then(i => {
  console.log(i) // 'Hello World'
})
db.delete('uniqueID')
db.fetch('uniqueID').then(i => {
  console.log(i) // NULL
})
```

---

<a name="push"></a>**.push(ID, data)** - *Pushes data to an array within the database*

*> Returns new data, or a non-breaking error message if you aren't pushing to an array.*

```js
db.set('uniqueID', ['Hello', 100])
db.fetch('uniqueID').then(i => {
  console.log(i) // ['Hello', 100]
})
db.push('uniqueID', 'World!')
db.fetch('uniqueID').then(i => {
  console.log(i) // ['Hello', 100, 'World!']
})
```

---

<a name="add"></a>**.add(ID, number)** - *Adds the specified amount to a pre-defined number*

*> Returns the new number, if either supply/target is not a number, it supplies a non-breaking error.* **If target was not defined previously, it automatically turns it in a number, and adds the specified amount.**

```js
db.set('uniqueID', 100)
db.fetch('uniqueID').then(i => {
  console.log(i) // 100
})

db.add('uniqueID', 400)
db.fetch('uniqueID').then(i => {
  console.log(i) // 500
  console.log(typeof i) // 'number'
})
```

---

<a name="subtract"></a>**.subtract(ID, number)** - *Subtracts the specified amount to a pre-defined number*

*> Returns the new number, if either supply/target is not a number, it supplies a non-breaking error.* **If target was not defined previously, it automatically turns it in a number, and subtracts the specified amount.**

```js
db.set('uniqueID', 500)
db.fetch('uniqueID').then(i => {
  console.log(i) // 500
})

db.subtract('uniqueID', 400)
db.fetch('uniqueID').then(i => {
  console.log(i) // 100
  console.log(typeof i) // 'number'
})
```

---

## <a name="FAQ"></a>Frequently Asked Questions

> How do I submit feedback, or suggest new features?

You can find a form [here](https://goo.gl/forms/KgjhQdWrztUfwHLB2).

> What happens if I fetch an ID without assigning any data to it.

It will return `NULL`.

> Where can I get support for Quick.db?

You can check out our [Discord](https://discord.io/plexidev)! In addition to support we have a great community.

> Is there a tutorial on Quick.db?

Not yet, although it was designed to be easy to learn, most can be found through the support Discord or documentation.

> Do you have a YouTube channel?

Okay, well it wasn't really frequently asked but I wanted to plug it anyways. Yes! I do have one here: https://www.youtube.com/c/TrueXPixels

---

## <a name="projects"></a>Projects Using Quick.db

*[How do I get here?](https://goo.gl/forms/KgjhQdWrztUfwHLB2)*

**[Plexi Development](https://discord.io/plexidev)** - *A majority of the server features on Plexi Development's Discord use Quick.db to store data.*

*Over **133** public programs also use **Quick.db** as a dependent!* [Source](https://github.com/TrueXPixels/quick.db/network/dependents)

---

*You've reached the end!*