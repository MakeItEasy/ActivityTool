define(function(require, exports, module) {
	var $ = require('../jquery-easyui/jquery.js');	
	require('../jquery-easyui/jquery-easyui.js');
	require('./ActivityToolSystem.js').init();
	
	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////
	
	$(function(){
		// 所有的子菜单添加单击事件
		$('.submenu').click(menu_click); 
	});
	
	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	function menu_click() {
		var strSrc = 'pages/welcome.html';
		switch(this.id) {
			case 'p-a':
				// 人员一览
				strSrc = 'pages/peopleList.html';
				break;
			case 'a-a':
				// 活动一览
				strSrc = 'pages/activityList.html';
				break;
			case 'a-b':
				// 新建活动
				window.parent.ActivitySystem.publicParam.updateActivityId = null;
				strSrc = 'pages/activityNew.html';
				break;
		}
		$('#mainArea').attr('src', strSrc);
	}
});