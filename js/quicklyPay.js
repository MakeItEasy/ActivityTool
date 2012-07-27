define(function(require, exports, module) {

	require('../jquery-easyui/themes/icon.css');
	
	var LoggerWrapper = require('./LoggerWrapper.js');
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var Util = require('./Util.js');
	var DBUtil = require('./DBUtil.js');
	var People = require('./People.js');
	var Rechange = require('./Rechange.js');
	
	ActivityToolSystem.init();

	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	$(function(){
		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;

		// 绑定画面的事件
		$('#btnQuicklyPay').click(btnQuicklyPay_click);
		
	});


	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	// 查询button按下处理
	function btnQuicklyPay_click(){
		var peopleId = 0;
		var money = 0;
		var person = null;
		var strMsg = '';
		// 表单验证
		var checkResult = Util.validateForm(document.forms['quicklyPayForm']);
		if(checkResult) {
			// 验证通过
			peopleId = $('#people_id').val();
			money = $('#money').val();
			person = People.queryById(peopleId);
			if(person != null)
			{
				if(person.deleteflag == Constants.deleteFlag.notDeleted)
				{
					Rechange.rechange(person, money);
					// 充值成功处理
					person = People.queryById(peopleId);
					strMsg = Message.I_R_00_000_0003.replace('{0}', person.id);
					strMsg = strMsg.replace('{1}', person.name);
					strMsg = strMsg.replace('{2}', money);
					strMsg = strMsg.replace('{3}', person.balance);
					
					ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005, msg : strMsg});
					
					$('#people_id').val('');
					$('#money').val('');
				}
				else
				{
					throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0009');
				}
			} else {
				throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0010');
			}
			
		}
	}

	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////

});