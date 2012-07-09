//////////////////////////////////////////////////////////
///               初始化加载部分                         ///
//////////////////////////////////////////////////////////

$(function(){
	// 所有的子菜单添加单击事件
	$('.submenu').click(menu_click); 
});


//////////////////////////////////////////////////////////
///               页面时间处理部分                       ///
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


//////////////////////////////////////////////////////////
///               页面私有函数部分                       ///
//////////////////////////////////////////////////////////

