// Require Package
let db = require("../index.js");

// Methods (everything should be true)
console.log("Adding Numbers:", typeof db.add("myNumber", 100) === "number");
console.log(
    "Setting Data:",
    typeof db.set("myData", "This data is here") === "string"
);
console.log("Deleting Data:", db.delete("myData"));
console.log("Fetching Deleted Data:", db.get("myData") === null);
console.log("Fetching Added Number:", typeof db.get("myNumber") === "number");
console.log("Pushing to an array:", db.push("myVal", "val") instanceof Array);
console.log("Fetching first prop of array:", db.get("myVal.0") === "val");
console.log(
    "Setting prop in object:",
    db.set("myObj.prop", "myProp").prop === "myProp"
);
console.log("Fetching prop in object:", db.get("myObj.prop") === "myProp");
console.log("Deleting prop in object:", db.delete("myObj.prop"));
console.log("Fetching deleted prop:", db.get("myObj.prop") === undefined);
console.log(
    "Subtracting from Numbers:",
    typeof db.subtract("myNumber", 50) === "number"
);
console.log(
    "Pushing in array in object:",
    db.push("myObj.arr", "myItem").arr instanceof Array
);

// Setting an object in the database:
console.log(db.set("userInfo", { difficulty: "Easy" }));
// -> { difficulty: 'Easy' }

// Pushing an element to an array (that doesn't exist yet) in an object:
console.log(db.push("userInfo.items", "Sword"));
// -> { difficulty: 'Easy', items: ['Sword'] }

// Adding to a number (that doesn't exist yet) in an object:
console.log(db.add("userInfo.balance", 500));
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }

// Repeating previous examples:
console.log(db.push("userInfo.items", "Watch"));
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
console.log(db.add("userInfo.balance", 500));
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }

// Fetching individual properties
console.log(db.get("userInfo.balance")); // -> 1000
console.log(db.get("userInfo.items")); // -> [ 'Sword', 'Watch' ]

// Fetching properties from specific tables
const test = new db.table("test");
test.set("data", "hello world");
console.log(db.get("data")); // -> null
console.log(db.get("data", { table: "test" })); // -> 'hello world'
console.log(test.get("data")); // -> 'hello world'
