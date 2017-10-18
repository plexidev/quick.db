Quick.db
========

**Note:** This package is under development and will be updated frequently.

This package is meant to provide an easy way to create and access a sqlite3 database.

**Installation**
```
npm install quick.db
```

**Require Package**
```
var database = require('quick.db');
```


**Fetch Balance**

No need to create a database, it does that automatically.
```js
database.fetchValue('ID').then((i) => {
    // Code goes here...
    console.log(i) // { ID: 'ID', value: 0 }
});
```


**Update Balance**

Value must be an integer. If you want to subtract from the value make it a negative number.

```js
database.updateBalance('ID', 'value').then((i) => {
	// Code goes here...
    console.log(i) // Returns the updated result. Example: If 'value' is 250, it would return { ID: 'ID', value: 250 }
});
```


**Example**
```js
// Call Packages
const database = require('quick.db')

// Fetches values from ID 1, then forwards it to i
database.fetchValue(1).then((i) => {
    console.log(i) // { ID: '1', value: 0 }
    console.log(i.value) // 0
})

// Fetches values from ID 1, adds 500 to it, then forwards the updated result to i
database.updateValue(1, 500).then((i) => {
    console.log(i) // { ID: '1', value: 500 }
    console.log(i.value) // 500
})

// Fetches values from ID 1, adds -250 to it, then forwards the update result to i
database.updateValue(1, -250).then((i) => {
    console.log(i) // { ID: '1', value: 250 }
    console.log(i.value) // 250
})
```
