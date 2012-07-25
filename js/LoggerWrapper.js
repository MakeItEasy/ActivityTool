define(function(require, exports, module) {

	var Log4js = require('../jslibs/log4js.js');
	
	// 对外接口
	exports.debug = debug;
	exports.info = info;
	exports.warn = warn;
	exports.error = error;
	exports.fatal = fatal;

	// Log4js包装对象
	var LoggerOption = {
		useLog4js : false,
		logFilePath : 'e:\\01_moyan\\00_moyan_SugarSync\\05_MyProject\\ActivityTool_hta\\03_source\\logs\\ActivityTool.log',
		logLevel : Log4js.Level.ALL,
		pattern : "[%d][%c][%p] - %m"
	};

	var LoggerWrapper = {
		logger : getFileLogger()
		/* delete enable
		debug : debug,
		info : info,
		warn : warn,
		error : error,
		fatal : fatal
		*/
	};

	// 得到控制台Logger对象
	function getWindowLogger() {
		var windowLogger = new Log4js.getLogger("ActivityTool"); 
		windowLogger.setLevel(LoggerOption.logLevel);
		var oLayout = new Log4js.PatternLayout(LoggerOption.pattern);
		var oAppender = new Log4js.ConsoleAppender(false);
		oAppender.setLayout(oLayout);
		windowLogger.addAppender(oAppender); 
		return windowLogger;
	}

	// 得到文件Logger对象
	function getFileLogger() {
		var fileLogger = new Log4js.getLogger('ActivityTool');
		fileLogger.setLevel(LoggerOption.logLevel);
		var oLayout = new Log4js.PatternLayout(LoggerOption.pattern);
		var oAppender = new Log4js.FileAppender(LoggerOption.logFilePath);
		oAppender.setLayout(oLayout);
		fileLogger.addAppender(oAppender);
		return fileLogger;
	}

	function debug(message) {
		if(LoggerOption.useLog4js) {
			LoggerWrapper.logger.debug(message);
		}
	}

	function info(message) {
		if(LoggerOption.useLog4js) {
			LoggerWrapper.logger.info(message);
		}
	}

	function warn(message) {
		if(LoggerOption.useLog4js) {
			LoggerWrapper.logger.warn(message);
		}
	}

	function error(message) {
		if(LoggerOption.useLog4js) {
			LoggerWrapper.logger.error(message);
		}
	}

	function fatal(message) {
		if(LoggerOption.useLog4js) {
			LoggerWrapper.logger.fatal(message);
		}
	}

});