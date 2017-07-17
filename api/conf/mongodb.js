const db = require('monk')('localhost:27017/operate');
module.exports = db;