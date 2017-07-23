const redis = require('redis')
//const connect  = redis.createClient('6379', '127.0.0.1');
//const connect = redis.createClient('6789', '127.0.0.1');
const connect  = redis.createClient('6666', '127.0.0.1');
// redis 链接错误
connect.on("error", function(error) {
    console.error("redis connect error:", error);
});
connect.auth("operate123...");
//connect.auth("zxww2016");

module.exports = connect;