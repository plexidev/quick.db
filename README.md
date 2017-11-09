

Quick.db
========


<div align="center">
    <p>
        <a href="https://discord.gg/6mcmDu4"><img src="https://discordapp.com/api/guilds/343572980351107077/embed.png" alt="Discord Server" /></a>
        <a href="http://www.youtube.com/subscription_center?add_user=TrueXPixels"><img src="https://img.shields.io/badge/Subscribe-YouTube-red.svg" alt="YouTube Channel" /></a>       
    </p>
</div>

**Note:** This package is under development and will be updated frequently.

This package is meant to provide an easy way to create and access a sqlite3 database.

**Installation**
```
npm install quick.db
```

**Require Package**
```
var database = require('quick.db')
```


**Fetch Object**

No need to create a database, it does that automatically.
```js
database.fetchObject('ID').then(i => {
    // Code goes here...
    console.log(i) // { ID: 'ID', value: 0, text: '' }
})
```


**Update Value**

Value must be an integer. This ADDS to the existing number, if you want to clear it use fetchObject then 
parseInt(\`-${i.value}\`) of the fetched. If you want to subtract do parseInt(`-${positiveNumber}`) or a negative number.

```js
database.updateValue('ID', 'value').then(i => {
	// Code goes here...
    console.log(i) // Returns the updated result. Example: If 'value' is 250, it would return { ID: 'ID', value: 250, text: '' }
})
```

**Update Text**

This resets the text to what you enter.

```js
database.updateText('ID', 'text').then(i => {
    // Code goes here...
    console.log(i) // Returns the updated result. Example: If 'text' was 'Hello', it would return { ID: 'ID', value: 0, text: 'Hello' }
})
```



**Example** [Another Example w/ Console(image)](https://i.gyazo.com/8ef58aac252fccc46a4c6eceb9505918.png)
```js
// Call Packages
const db = require('quick.db')

// Fetches values from ID 1, then forwards it to i
db.fetchObject('user').then(i => {
    console.log(i) // { ID: 'user', value: 0, text: '' }
    console.log(i.value) // 0
})

// Fetches values from ID 1, adds 500 to it, then forwards the updated result to i
db.updateValue('user', 500).then(i => {
    console.log(i) // { ID: 'user', value: 500, text: '' }
    console.log(i.value) // 500
})

// Fetches values from ID 1, adds -250 to it, then forwards the update result to i
db.updateValue('user', -250).then(i => {
    console.log(i) // { ID: 'user', value: 250, text: '' }
    console.log(i.value) // 250
})

db.updateText('user', 'This is a stored string!').then(i => {
    console.log(i) // { ID: 'user', value: 250, text: 'This is a stored string!' }
    console.log(i.text) // 'This is a stored string!'
})
```
