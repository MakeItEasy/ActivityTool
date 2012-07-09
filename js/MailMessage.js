// 邮件消息


//////////////////////////////////////////////////////////
///               构造函数部分                           ///
//////////////////////////////////////////////////////////
function MailMessage() {
	this.title = '';
	this.to = [];
	this.cc = [];
	this.header = '';
	this.content = '';
	this.footer = '';
}

// 克隆方法
MailMessage.prototype.clone = function() {
	var msg = new MailMessage();
	msg.title = this.title;
	msg.to = [];
	msg.cc = [];
	msg.header = this.header;
	msg.content = this.content;
	msg.footer = this.footer;
	return msg;
}

// toString方法
MailMessage.prototype.toString = function() {
	var str;
	str = "title : " + this.title + ", ";
	str += "to : [" + Util.arrToString(this.to) + "], ";
	str += "cc : [" + Util.arrToString(this.cc) + "], ";
	str += "header : " + this.header + ", ";
	str += "content : " + this.content + ", ";
	str += "footer : " + this.footer;
	return str;
}