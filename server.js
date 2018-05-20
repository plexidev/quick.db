/*
# server.js & json.sqlite
# allow for shared testing
#
# These files are ignored when pushing to NPM
#
*/

// Require Package
const db = require('./index.js');

// Create Webviewer
db.createWebview('pass111', process.env.PORT);

// Tables
let economy = new db.table('Economy');
let guilds = new db.table('GuildInfo');

economy.set(`userBalance_643862142520395322`, 5500);
economy.set(`userBalance_283862626520399872`, 1500);
economy.set(`userBalance_258622912095846400`, 2000);
economy.set(`userBalance_245565031490519040`, 500);
economy.set(`userBalance_144645791145918464`, 1000);
economy.set(`userBalance_283862520399872` , 6500);

guilds.set(`guildName_343572980351107077`, 'Plexi Development');
guilds.set(`guildName_316720611453829121`, 'Nitro');
guilds.set(`guildName_417723229721853963`, 'Guilds List');
guilds.set(`guildName_425820587252908037`, 'Another Test Server');

db.set(`generalInfo`, { name: 'TrueXPixels', discrim: '#0001' });
db.set(`restartCount`, 25);
db.set(`cmdCount`, 5);
db.set(`authorID`, '144645791145918464');

const configDefaults = {
    modLog: 'None'
};

economy.startsWith('userBalance', { sort: '.data' }).then(i => console.log(i));