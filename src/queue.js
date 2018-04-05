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
    delete: function(ID) {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "deleteDebug",
                "args": [ID],
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
    fetchAll: function() {
        return new Promise((resolve, error) => {
            executeQueue({
                "fun": "fetchAllDebug",
                "args": [],
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