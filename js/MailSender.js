// 发送邮件工具
define(function(require, exports, module) {
		
	// 用CMail服务器

	var MailSender = {
		send : sendMail,
		option : {
			mailServer : '127.0.0.1',
			mailServerUserName : "Admin",
			mailServerPassWord : "admin",
			fromName : 'administrator',
			from : 'admin@moyan-pc.com'
		}
	};


	// 用公司邮箱
	/*
	var MailSender = {
		send : sendMail,
		option : {
			mailServer : 'mail.use.com.cn',
			mailServerUserName : "dairugang",
			mailServerPassWord : "19860420drg",
			fromName : 'administrator',
			from : 'dairugang@use.com.cn'
		}
	};
	*/


	// 发送邮件方法
	// 返回值 true：发送成功 false：发送失败
	function sendMail(message) {
		var jMail = getJMailObj();

		// 设置主题
		jMail.Subject = message.title;

		// 添加TO收件人
		if(message.to) {	
			for(var i=0; i<message.to.length; i++) {
				jMail.AddRecipient(message.to[i]);
			}
		}
		
		// 添加CC收件人
		if(message.cc) {	
			for(var i=0; i<message.cc.length; i++) {
				jMail.AddRecipientCC(message.cc[i]);
			}
		}
		
		// 添加CC收件人
		
		// 设置邮件内容
		var strBody = message.header;
		strBody += message.content;
		strBody += message.footer;
		jMail.Body = strBody;
		
		// 发送邮件
		var ret = jMail.Send(MailSender.option.mailServer);
		jMail.Close();
		// 返回发送结果
		return ret;
	}

	// 取得邮件对象
	function getJMailObj() {
		var jMail = new ActiveXObject("Jmail.message");
		jMail.Silent = true;
		jMail.Charset = "utf-8";
		jMail.Encoding = "utf-8";
		jMail.FromName = MailSender.option.fromName;
		jMail.From = MailSender.option.from;
		jMail.MailServerUserName = MailSender.option.mailServerUserName;
		jMail.MailServerPassWord = MailSender.option.mailServerPassWord;
		return jMail;
	}
	
	return MailSender;
});