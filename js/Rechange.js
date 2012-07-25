define(function(require, exports, module) {

	var LoggerWrapper = require('./LoggerWrapper.js');
	var Constants = require('./Constants.js');
	var DBUtil = require('./DBUtil.js');
	
	//////////////////////////////////////////////////////////
	///               构造函数部分                           ///
	//////////////////////////////////////////////////////////
	function Rechange(pPeople, pBalance)
	{
		this.people = pPeople;
		this.balance = pBalance;
	}

	//////////////////////////////////////////////////////////
	///               类常量部分                            ///
	//////////////////////////////////////////////////////////

	Rechange.insertSql = "INSERT INTO t_rechange VALUES ('{0}', '{1}', '{2}');";
	Rechange.updateSql = "UPDATE t_people SET account_balance=account_balance+{0} WHERE people_id='{1}';";


	//////////////////////////////////////////////////////////
	///               类方法部分                           ///
	//////////////////////////////////////////////////////////

	// 对多个人集体充值
	// peoples : 人员数组
	// balance : 充值金额
	Rechange.mulRechange = function(peoples, balance) {
		var sqls = getRechangeSqls(peoples, balance);
		try {
			DBUtil.executeSqls(sqls);
		} catch(ex) {
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_R_00_000_0001');
		}
	}


	// 对1个人集体充值
	// peoples : 一个人员信息
	// balance : 充值金额
	Rechange.rechange = function(people, balance) {
		var peoples = [];
		if(people != null) {
			peoples = [people];
		}
		Rechange.mulRechange(peoples, balance);
	}


	//////////////////////////////////////////////////////////
	///               对象方法部分                          ///
	//////////////////////////////////////////////////////////




	// toString方法
	Rechange.prototype.toString = function()
	{
		var str = 'Rechange';
		return str;
	}

	//////////////////////////////////////////////////////////
	///              私有方法部分                          ///
	//////////////////////////////////////////////////////////

	// 取得充值用的SQL数组
	function getRechangeSqls(peoples, balance) {
		var sqls = [];
		var date = new Date();
		if(peoples != null && peoples.length > 0 && balance) {
			for(var i=0; i<peoples.length; i++) {
				// 向充值表插入数据SQL
				var strTemp = Rechange.insertSql.replace('{0}', peoples[i].id);
				strTemp = strTemp.replace('{1}', date.format());
				strTemp = strTemp.replace('{2}', balance);
				sqls.push(strTemp);
				// 更新人员表余额SQL
				strTemp = Rechange.updateSql.replace('{0}', balance);
				strTemp = strTemp.replace('{1}', peoples[i].id);
				sqls.push(strTemp);
			}
		}
		return sqls;
	}
	
	return Rechange;
});
