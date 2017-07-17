var restify = require('restify');
var plugins = require('restify-plugins');
var routes = require('./router/index.js');

var server = restify.createServer({
	name: 'hfw_operation',
	version: '1.0.0'
});
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

routes(server);

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});


