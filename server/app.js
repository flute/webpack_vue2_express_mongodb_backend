var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var routes = require('./routes/index');
//var redisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors允许跨域请求
app.use(cors({
	origin:['http://localhost:8080'],
	methods:['OPTIONS','GET','POST'],
	credentials: true
}));

// cookie
app.use(cookieParser());
app.use(session({
	secret: 'backend123',
	name:'backend',
	cookie: {
		maxAge: 1000 * 60 * 60,
	},// 1h
	resave: true,
	saveUninitialized: false,
}));

routes(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
