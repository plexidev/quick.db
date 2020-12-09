// Require Packages
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = function(db, params, options) {
  
   /**
 * This function initialize the database on the sqlite file of your choice.
 * @param {string} dbname the string of the sqlite file path
 * @returns {boolean} if it was a success or not.
 */

 init: function(dbpath='./json.sqlite'){
    db = new Database(dbpath);
    return true;
 },
// If the database has not previously been defined by the init function
  if(!db) db = new Database('./json.sqlite');
  
}
