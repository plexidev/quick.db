

Quick.db 
========

<div align="center">
    <p>
        <a href="https://discord.gg/6mcmDu4"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
        <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>       
    </p>
</div>

**Note:** This package is under development and will be updated frequently.

This package is meant to provide an easy way to create and use a database, **all data is stored persistently**, comes with a **queue system to prevent database locking**.

---

**Installation**
```
npm install quick.db
```


**Require Package**
```
var db = require('quick.db')
```

## Usage

**.set(ID, data)** - *Assigns the given data to the given ID*

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

**.fetch(ID)** - *Fetches the data from the given ID*

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

**.delete(ID)** - *Deletes the specified ID & data from the database*

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