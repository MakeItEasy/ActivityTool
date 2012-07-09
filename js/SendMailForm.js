//////////////////////////////////////////////////////////
///               构造函数部分                           ///
//////////////////////////////////////////////////////////

// 构造函数
function SendMailForm(handler) {
	
	SendMailForm.mailHandler = handler;
	
	<!-- 活动信息页面 -->
	$('#sendMail').window({
		title: '邮件发送',
		iconCls: 'icon-search',
		width: 750,
		height: 500,
		modal: true,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable : false,
		draggable: true,
		closed: true
	});
	
	$('#sendMail_send').click(sendMail_send_click);
	$('#sendMail_cancel').click(sendMail_cancel_click);
}


//////////////////////////////////////////////////////////
///               对象方法部分                          ///
//////////////////////////////////////////////////////////
SendMailForm.prototype.openWindow= function(msg) {
	SendMailForm.initWindow(msg);
	$('#sendMail').window('open');
}

//////////////////////////////////////////////////////////
///               页面事件处理部分                       ///
//////////////////////////////////////////////////////////

// [确认]click处理
function sendMail_send_click() {
	var msg = SendMailForm.getMessageFromView();
	if(SendMailForm.mailHandler) {
		SendMailForm.mailHandler.message = msg;
		SendMailForm.mailHandler.process();
	} else {
		var handler = new MailHandler();
		handler.message = msg;
		handler.process();
	}
	$('#sendMail').window('close');
}

// [取消]click处理
function sendMail_cancel_click() {
	$('#sendMail').window('close');
}


//////////////////////////////////////////////////////////
///               页面私有函数部分                       ///
//////////////////////////////////////////////////////////


SendMailForm.getMessageFromView = function() {
	var msg = new MailMessage();
	var strTo = $('#sendMail_to').val();
	var strCC = $('#sendMail_cc').val();
	if(strTo.trim() != '') {
		msg.to = strTo.split(",");
	}
	if(strCC.trim() != '') {
		msg.cc = strCC.split(",");
	}
	msg.title = $('#sendMail_title').val();
	msg.header = '';
	msg.footer = '';
	msg.content = $('#sendMail_content').val();
	return msg;
}


// 初期显示时处理
SendMailForm.initWindow = function(msg) {
	// 初始化Form处理
	Util.initForm(document.forms['mailForm']);
	// 清空所有输入框
	$('#sendMail_to').val('');
	$('#sendMail_cc').val('');
	$('#sendMail_title').val('');
	$('#sendMail_content').val('');
		
	if(msg) {
		// 收件人的设定
		if(msg.to) {
			$('#sendMail_to').val(msg.to.join(","));
		}
		// CC的设定
		if(msg.cc) {
			$('#sendMail_cc').val(msg.cc.join(","));
		}
		// 主题的设定
		$('#sendMail_title').val(msg.title);
		// 内容的设定
		$('#sendMail_content').val(msg.header + msg.content + msg.footer);
	}	
}

