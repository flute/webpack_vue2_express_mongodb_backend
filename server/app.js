var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cors = require('cors');
// log4js
var log4js = require("./conf/log.js");
// 定时
var schedule = require('node-schedule');
// 提醒通知
var timing = require('./models/noticeModels/serviceNotice');
// 每月账单
var bill = require('./models/billModels/bill');
// 重启
var restartOption = require('./models/restartOption');
// routes
var routes = require('./routes/index');


var app = express();
log4js.use(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors允许跨域请求
app.use(cors({
	origin:['http://localhost:8080','http://localhost:8000','http://testapi.zxwave.com:9999','http://60.205.110.195:9999'],
	//origin:['http://101.201.54.133','http://www.zxwave.com','http://market.haofenwei.net'],
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
	saveUninitialized: true,
	store: new RedisStore({
		host: "127.0.0.1",
		port: 6666,
		pass: 'operate123...'
		/*port: 6789,
		pass: 'zxww2016'*/
	})
}));

routes(app)

// restart option
restartOption()
// schedule task
var task = schedule.scheduleJob('0 0 2 * * *', function(){
	console.info('定时任务：到期提醒', new Date());
	timing()
});
//var task = schedule.scheduleJob('0 * * * * *', function(){
var task = schedule.scheduleJob('0 0 0 1 * *', function(){
	console.info('定时任务：月账单', new Date());
	bill()
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
