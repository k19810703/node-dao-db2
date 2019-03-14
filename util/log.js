const Log = require('log');

const logLevel = process.env.Loglevel || 'Debug';
module.exports.log = new Log(logLevel);
