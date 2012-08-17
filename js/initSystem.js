define(function(require, exports, module) {

	require('../jquery-easyui/themes/icon.css');
	
	var LoggerWrapper = require('./LoggerWrapper.js');
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var DBUtil = require('./DBUtil.js');
	
	ActivityToolSystem.init();

	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	$(function(){
		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;

		// 绑定画面的事件
		$('#btnInitSystem').click(btnInitSystem_click);
		
	});


	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	// 系统初始化button按下处理
	function btnInitSystem_click(){
		
		var initSystem = function(r) {
			if(r) {
				var sqls = [];
				sqls.push("delete from t_rechange;");
				sqls.push("delete from t_activity_people;");
				sqls.push("delete from t_people;");
				sqls.push("delete from t_activity;");
				try {
					DBUtil.executeSqls(sqls);
					// 初始化成功处理
					ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005, msg : Message.I_C_00_000_0008 });
				}
				catch (ex)
				{
					LoggerWrapper.error(ex);
					throw new Error(Constants.errorNumber.defaultNumber, 'E_C_00_000_0003');
				}
			}
		}
		
		// 弹出确认框
		$.messager.confirm(Message.T_C_00_000_0002, Message.W_C_00_000_0003, initSystem);
	}

	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////

});