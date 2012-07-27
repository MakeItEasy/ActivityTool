define(function(require, exports, module) {
	
	var LoggerWrapper = require('./LoggerWrapper.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var Util = require('./Util.js');
	var People = require('./People.js');
	var MailSender = require('./MailSender.js');
	var MailTemplate = require('./MailTemplate.js');
	
	ActivityToolSystem.init();


	//////////////////////////////////////////////////////////
	///               抽象MailHandler部分                  ///
	//////////////////////////////////////////////////////////

	// 抽象的邮件处理类
	function MailHandler() {
		this.message = null;
		this.isMailable = true;
		this.params = null;
	}

	// 邮件处理函数
	MailHandler.prototype.process = function() {
		var isMailable = this.getMailable();
		var msg = this.getMessage();
		if(isMailable && msg) {
			if(MailSender.send(msg)) {
				// 发送成功
				this.sendMailSuccessProcess(this.params);
			} else {
				// 发送失败
				this.sendMailFailProcess();
			}
		}
	}
	
	// 邮件处理函数，只负责发送，返回发送结果(true:成功 false:失败)
	MailHandler.prototype.sendMail = function() {
		var isMailable = this.getMailable();
		var msg = this.getMessage();
		var ret = true;
		if(isMailable && msg) {
			ret = MailSender.send(msg);
		}
		return ret;
	}

	// 得到Message对象方法
	// 要被其他具体的handler重写
	MailHandler.prototype.getMessage = function() {
		return this.message;
	}

	// 设置Message对象
	MailHandler.prototype.setMessage = function(msg) {
		this.message = msg;
	}

	// 取得是否发送邮件标志位
	MailHandler.prototype.getMailable = function() {
		return this.isMailable;
	}

	// 邮件发送成功处理
	MailHandler.prototype.sendMailSuccessProcess = function() {
		ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0006, msg : Message.I_C_00_000_0003});
	}

	// 邮件发送失败处理
	MailHandler.prototype.sendMailFailProcess = function() {
		throw new Error(Constants.errorNumber.defaultNumber, 'E_C_00_000_0002');
	}


	//////////////////////////////////////////////////////////
	///               邀请函邮件处理类部分                  ///
	//////////////////////////////////////////////////////////

	// 邀请函邮件处理类
	function WelcomeMailHandler(activity) {
		this.activity = activity;
		this.isMailable = true;
		this.message = WelcomeMailHandler.getDefaultMessage(activity);
		this.params = null;
	}

	WelcomeMailHandler.prototype = new MailHandler();

	// 得到默认Message对象
	WelcomeMailHandler.getDefaultMessage = function(act) {
		var msg = MailTemplate.WelcomeTemplate.clone();
		if(act) {
			msg.title = msg.title.replace("%N", act.activity_name);
			msg.content = msg.content.replace("%D", act.activity_date);
			msg.content = msg.content.replace("%K", Util.getActivityKindTextById(act.activity_kind));
			msg.to = [];
			var arrIds = [];
			for(var i=0; i<act.activity_members.length; i++) {
				msg.to.push(act.activity_members[i].email);
				arrIds.push(act.activity_members[i].id);
			}
			// 查询默认接受一切邮件并且不在参加活动列表中的人员
			var peoples = People.queryNotIncludeIds(arrIds, true);
			// 把上面查到的人员添加到收件人中
			for(var i=0; i<peoples.length; i++) {
				msg.to.push(peoples[i].email);
			}
		}
		return msg;
	}

	//////////////////////////////////////////////////////////
	///               确认函邮件处理类部分                  ///
	//////////////////////////////////////////////////////////

	// 邀请函邮件处理类
	function MakesureMailHandler(activity) {
		this.activity = activity;
		this.isMailable = true;
		this.message = MakesureMailHandler.getDefaultMessage(activity);
		this.params = null;
	}

	MakesureMailHandler.prototype = new MailHandler();

	// 得到默认Message对象
	MakesureMailHandler.getDefaultMessage = function(act) {
		var msg = MailTemplate.MakesureTemplate.clone();
		if(act) {
			msg.title = msg.title.replace("%N", act.activity_name);
			msg.content = msg.content.replace("%C", act.activity_info1);
			msg.to = [];
			var strMemberNameList = '';
			var arrIds = [];
			for(var i=0; i<act.activity_members.length; i++) {
				msg.to.push(act.activity_members[i].email);
				arrIds.push(act.activity_members[i].id);
				strMemberNameList += (i+1) + '.' + act.activity_members[i].name + Constants.enterKey;
			}
			// 查询默认接受一切邮件并且不在参加活动列表中的人员
			var peoples = People.queryNotIncludeIds(arrIds, true);
			// 把上面查到的人员添加到收件人中
			for(var i=0; i<peoples.length; i++) {
				msg.to.push(peoples[i].email);
			}
			// 替换参加活动人员列表内容
			msg.content = msg.content.replace("%P", strMemberNameList);
		}
		return msg;
	}


	//////////////////////////////////////////////////////////
	///               取消函邮件处理类部分                  ///
	//////////////////////////////////////////////////////////

	// 邀请函邮件处理类
	function CancelMailHandler(activity) {
		this.activity = activity;
		this.isMailable = true;
		this.message = CancelMailHandler.getDefaultMessage(activity);
		this.params = null;
	}

	CancelMailHandler.prototype = new MailHandler();

	// 得到默认Message对象
	CancelMailHandler.getDefaultMessage = function(act) {
		var msg = MailTemplate.CancelTemplate.clone();
		if(act) {
			msg.title = msg.title.replace("%N", act.activity_name);
			msg.content = msg.content.replace("%D", act.activity_date);
			msg.content = msg.content.replace("%K", Util.getActivityKindTextById(act.activity_kind));
			msg.to = [];
			var arrIds = [];
			for(var i=0; i<act.activity_members.length; i++) {
				msg.to.push(act.activity_members[i].email);
				arrIds.push(act.activity_members[i].id);
			}
			// 查询默认接受一切邮件并且不在参加活动列表中的人员
			var peoples = People.queryNotIncludeIds(arrIds, true);
			// 把上面查到的人员添加到收件人中
			for(var i=0; i<peoples.length; i++) {
				msg.to.push(peoples[i].email);
			}
		}
		return msg;
	}

	//////////////////////////////////////////////////////////
	///               结算邮件处理类部分                  ///
	//////////////////////////////////////////////////////////

	// 邀请函邮件处理类
	function PayMailHandler(activity) {
		this.activity = activity;
		this.isMailable = true;
		this.message = PayMailHandler.getDefaultMessage(activity);
		this.params = null;
	}

	PayMailHandler.prototype = new MailHandler();

	// 得到默认Message对象
	PayMailHandler.getDefaultMessage = function(act) {
		var msg = MailTemplate.PayTemplate.clone();
		if(act) {
			msg.title = msg.title.replace("%N", act.activity_name);
			msg.content = msg.content.replace("%H", act.activity_members.length);
			msg.content = msg.content.replace("%G", act.activity_cost);
			msg.to = [];
			// 结算清单
			var strPayList = "";
			var strItemTemp = "";
			// 余额清单
			var strRechangeList = "";
			
			var arrIds = [];
			for(var i=0; i<act.activity_members.length; i++) {
				arrIds.push(act.activity_members[i].id);
				LoggerWrapper.debug("[PayMailHandler.getDefaultMessage] act.activity_members[" + i + "]"
				 + Util.objToString(act.activity_members[i]));
				strItemTemp = MailTemplate.PayTemplate.PayListItemFormat.replace("{0}", (i+1)); 
				strItemTemp = strItemTemp.replace("{1}", act.activity_members[i].name); 
				strItemTemp = strItemTemp.replace("{2}", Util.formatMoney(Number(act.activity_members[i].pay_number)));
				strPayList += strItemTemp + Constants.enterKey;
				
				LoggerWrapper.debug("[PayMailHandler.getDefaultMessage] strItemTemp " + i + strItemTemp);
			}
			// 替换结算清单内容
			msg.content = msg.content.replace("%I", strPayList);
			
			// 查询默认接受一切邮件或者在参加活动列表中的人员
			var peoples = People.queryIncludeIds(arrIds, true);
			// 把上面查到的人员添加到收件人中，并且得到余额清单
			for(var i=0; i<peoples.length; i++) {
				msg.to.push(peoples[i].email);
				strItemTemp = MailTemplate.PayTemplate.RechangeListItemFormat.replace("{0}", (i+1)); 
				strItemTemp = strItemTemp.replace("{1}", peoples[i].name); 
				strItemTemp = strItemTemp.replace("{2}", Util.formatMoney(Number(peoples[i].balance)));
				strRechangeList += strItemTemp + Constants.enterKey;
			}
			
			// 替换余额列表内容
			msg.content = msg.content.replace("%J", strRechangeList);
		}
		return msg;
	}
	
	//////////////////////////////////////////////////////////
	///         余额不足提醒通知邮件处理类部分             ///
	//////////////////////////////////////////////////////////

	// 邀请函邮件处理类
	function BalanceRemindMailHandler(people) {
		this.people = people;
		this.isMailable = true;
		this.message = BalanceRemindMailHandler.getDefaultMessage(people);
		this.params = null;
	}

	BalanceRemindMailHandler.prototype = new MailHandler();

	// 得到默认Message对象
	BalanceRemindMailHandler.getDefaultMessage = function(people) {
		var msg = MailTemplate.BalanceRemindTemplate.clone();
		if(people) {
			msg.title = msg.title.replace("%N", people.name);
			msg.header = msg.header.replace("%N", people.name);
			msg.content = msg.content.replace("%J", people.balance);

			msg.to = [];
			msg.to.push(people.email);
		}
		return msg;
	}

	exports.MailHandler = MailHandler;
	exports.WelcomeMailHandler = WelcomeMailHandler;
	exports.MakesureMailHandler = MakesureMailHandler;
	exports.CancelMailHandler = CancelMailHandler;
	exports.PayMailHandler = PayMailHandler;
	exports.BalanceRemindMailHandler = BalanceRemindMailHandler;

});