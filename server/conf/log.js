//日志记录
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type:'console'
        },
        {
            type: 'logLevelFilter',
            level: 'INFO',
            appender:{
                type : 'dateFile',
                filename : 'logs/',
                pattern : 'yyyy-MM-dd.log',
                alwaysIncludePattern : true,
                category : 'record'
            }
            
        }
    ],
    replaceConsole: true
});

var dateFileLog = log4js.getLogger('record');
dateFileLog.debug("currentTime=%s",new Date());

exports.use = function(app) {
    app.use(log4js.connectLogger(dateFileLog, {level:'INFO', format:':method :url'}));
}
