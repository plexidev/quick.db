

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

## Usage

**Fetch Object**

No need to create a database OR object, it does everything automatically.
```js
database.fetchObject('ID').then(i => {
    // Code goes here...
    console.log(i) // { ID: 'ID', value: 0, text: '' }
})
```


**Update Value**

Value must be an integer. This ADDS to the existing number, if you want to clear it use fetchObject then 
parseInt(\`-${i.value}\`) of the fetched. If you want to subtract do parseInt(\`-${positiveNumber}\`) or a negative number.

```js
database.updateValue('ID', 'value').then(i => {
	// Code goes here...
    console.log(i) // Returns the updated result. 
    // Example: If 'value' is 250, it would return { ID: 'ID', value: 250, text: '' }
})
```

**Update Text**

This resets the text to what you enter.

```js
database.updateText('ID', 'text').then(i => {
    // Code goes here...
    console.log(i) // Returns the updated result. 
    // Example: If 'text' was 'Hello', it would return { ID: 'ID', value: 0, text: 'Hello' }
})
```

**Fetch Array**
```js
database.fetchArray('ID').then(array => {
    // Code goes here...
    console.log(array) // Returns an array. 
    // If no items in array it will return empty.
})
```

**Set Array**
```js
database.setArray('ID', ['newArray']).then(array => {
    // Code goes here...
    console.log(array) // Returns the new array. 
    // Example: ['item1', 'item2', 'item3']
})
```

**Example |**  [Another Example w/ Console(image)](https://i.gyazo.com/8ef58aac252fccc46a4c6eceb9505918.png)
```js
// Call Packages
const db = require('quick.db')

// Fetches values from ID user, then forwards it to i
db.fetchObject('user').then(i => {
    console.log(i) // { ID: 'user', value: 0, text: '' }
    console.log(i.value) // 0
})

// Fetches values from ID user, adds 500 to it, then forwards the updated result to i
db.updateValue('user', 500).then(i => {
    console.log(i) // { ID: 'user', value: 500, text: '' }
    console.log(i.value) // 500
})

// Fetches values from ID user, adds -250 to it, then forwards the updated result to i
db.updateValue('user', -250).then(i => {
    console.log(i) // { ID: 'user', value: 250, text: '' }
    console.log(i.value) // 250
})

// Fetches values from ID user, updates text, then forwards the updated result to i
db.updateText('user', 'This is a stored string!').then(i => {
    console.log(i) // { ID: 'user', value: 250, text: 'This is a stored string!' }
    console.log(i.text) // 'This is a stored string!'
})

////////////
// ARRAYS //
////////////

// This sets the array associated with the ID 'items'
db.setArray('items', ['bucket', 'sword', 'shoes']).then(array => {
    console.log(array) // ['bucket', 'sword', 'shoes']
})

// This fetches the array associated with the ID 'items'
db.fetchArray('items').then(array => {
    console.log(array) // ['bucket', 'sword', 'shoes']
})

// This pushes a new item to the already existing array
db.fetchArray('items').then(orgArray => {

    // Push new item to orgArray
    orgArray.push('pitchfork')
    
    db.setArray('items', orgArray).then(newArray => {
        console.log(newArray) // ['bucket', 'sword', 'shoes', 'pitchfork']
    })
    
})

```

## Projects Using quick.db
[Infinitude](https://discordbots.org/bot/346516120322179072) **-** A fully customizable, modular, multi-use discord bot. **-** By *TrueXPixels*
    
[Immortal](https://discordbots.org/bot/365689417052192799) **-** A multi-functional discord.js automaton. **-** By *Immortality*