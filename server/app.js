var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
// 定时
var schedule = require('node-schedule');
var timing = require('./models/noticeModels/serviceNotice');
var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors允许跨域请求
app.use(cors({
	origin:['http://localhost:8080','http://localhost:8000','http://testapi.zxwave.com:9999','http://60.205.110.195:9999'],
	methods:['OPTIONS','GET','POST'],
	credentials: true
}));

// cookie
app.use(cookieParser());
app.use(session({
	secret: 'operate123...',
	name:'operate',
	cookie: {
		maxAge: 1000 * 60 * 60,
	},// 1h
	resave: true,
	saveUninitialized: false,
}));

routes(app)

var task = schedule.scheduleJob('* * 2 * * *', function(){
	console.info('定时任务：到期提醒');
	timing()
});

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

app.listen(3600, function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
