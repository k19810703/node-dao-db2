const Log = require('log');

const logLevel = process.env.Loglevel || 'Info';
module.exports.log = new Log(logLevel);
