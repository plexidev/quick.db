// Require Packages
const Database = require('better-sqlite3');

let queue = [],
  connection = false,
  db,
  webview = false;

function executeQueue(object, queue) {
  if (object) {
    queue.push(object);
    if (queue.length > 1) return;
  }
  switch (queue.length) {
    case 0:
      db.close();
      db = undefined;
      break;
    default:
      if (!db) db = new Database('./json.sqlite');
      let realObj = object ? object : queue[0];
      realObj.args.push(db)
      realObj.args.push(webview)
      tools[realObj.fun](...realObj.args).then((...result) => {
        realObj.innerFunc[0](...result);
        queue.shift();
        executeQueue(null, queue);
      }).catch((...err) => {
        realObj.innerFunc[1](...err);
        queue.shift();
        executeQueue(null, queue);
      });
  }
}

var tools = module.exports = {
  // Queues
  fetch: function(ID, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "fetchDebug",
        "args": [ID, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  set: function(ID, data, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "setDebug",
        "args": [ID, data, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  delete: function(ID, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "deleteDebug",
        "args": [ID, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  push: function(ID, data, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "pushDebug",
        "args": [ID, data, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  add: function(ID, data, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "addDebug",
        "args": [ID, data, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  subtract: function(ID, data, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "subtractDebug",
        "args": [ID, data, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  fetchAll: function(options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "fetchAllDebug",
        "args": [options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  startsWith: function(startsWith, options) {
    return new Promise((resolve, error) => {
      executeQueue({
        "fun": "startsWithDebug",
        "args": [startsWith, options],
        "innerFunc": [resolve, error]
      }, queue);
    });
  },
  // Events
  createWebview: require('./webviewer/createWebview.js'),
  table: function(name) {

    // Table Name Verification
    if (typeof name !== 'string') return console.log('Sorry, please verify that name of the table is a string');
    if (name.includes(' ')) return console.log('Sorry, the table name cannot include spaces');
    this.name = name; // Set Name

    // Parse Fetch
    this.fetch = function(ID, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "fetchDebug",
          "args": [ID, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse Set
    this.set = function(ID, data, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "setDebug",
          "args": [ID, data, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse Delete
    this.delete = function(ID, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "deleteDebug",
          "args": [ID, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse Push
    this.push = function(ID, data, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "pushDebug",
          "args": [ID, data, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse Add
    this.add = function(ID, data, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "addDebug",
          "args": [ID, data, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse Subtract
    this.subtract = function(ID, data, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "subtractDebug",
          "args": [ID, data, options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse FetchAll
    this.fetchAll = function(options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "fetchAllDebug",
          "args": [options],
          "innerFunc": [resolve, error]
        }, queue);
      });
    }

    // Parse StartsWith
    this.startsWith = function(startsWith, options) {
      if (!options) options = {};
      options.table = this.name;
      return new Promise((resolve, error) => {
        executeQueue({
          "fun": "startsWithDebug",
          "args": [startsWith, options],
          "innerFunc": [resolve, error]
        }, queue);

      })

    }



  },
  // Functions
  fetchDebug: require('./functions/fetch.js'),
  setDebug: require('./functions/set.js'),
  deleteDebug: require('./functions/delete.js'),
  pushDebug: require('./functions/push.js'),
  addDebug: require('./functions/add.js'),
  subtractDebug: require('./functions/subtract.js'),
  fetchAllDebug: require('./functions/fetchAll.js'),
  startsWithDebug: require('./functions/startsWith.js')
};