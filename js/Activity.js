define(function(require, exports, module) {

	var LoggerWrapper = require('./LoggerWrapper.js');
	var Constants = require('./Constants.js');
	var DBUtil = require('./DBUtil.js');
	var Util = require('./Util.js');

	//////////////////////////////////////////////////////////
	///               构造函数部分                           ///
	//////////////////////////////////////////////////////////
	function Activity(activityInfo)
	{
		if(activityInfo)
		{
			this.activity_id = activityInfo.activity_id;
			this.activity_name = activityInfo.activity_name;
			this.activity_kind = activityInfo.activity_kind;
			this.activity_date = activityInfo.activity_date;
			this.activity_cost = activityInfo.activity_cost;
			this.activity_status = activityInfo.activity_status;
			this.activity_memo = activityInfo.activity_memo;
			this.activity_info1 = activityInfo.activity_info1;
			this.activity_info2 = activityInfo.activity_info2;
			this.activity_info3 = activityInfo.activity_info3;
			this.activity_info4 = activityInfo.activity_info4;
			this.activity_info5 = activityInfo.activity_info5;
		}
		this.activity_members = [];
		// 默认查询选项
		this.queryOption = {andOr : Constants.sql.and, equalOrLike : Constants.sql.equal};
	}

	//////////////////////////////////////////////////////////
	///               类常量部分                            ///
	//////////////////////////////////////////////////////////
	// 操作表名
	Activity.TABLENAME = "t_activity";
	Activity.TABLENAME2 = "t_activity_people";
	Activity.FIELDS = ['activity_id', 'activity_name', 'activity_kind', 'activity_date', 'activity_cost', 'activity_status', 'activity_memo', 'activity_info1', 'activity_info2', 'activity_info3', 'activity_info4', 'activity_info5'];


	//////////////////////////////////////////////////////////
	///               类方法部分                            ///
	//////////////////////////////////////////////////////////

	// 取得最大的ID
	Activity.getNextActivityId = function()
	{
		var fields = ['max(activity_id)'];
		var fieldsAlias = ['maxId'];
		var newActivityId = 0;
		
		try
		{
				var results = DBUtil.query(fields, Activity.TABLENAME, null, null, fieldsAlias, null);
				newActivityId = results[0].maxId;
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0004');
		}
		return (newActivityId+1);
	}

	// 取得唯一的名字
	Activity.getUniqueActivityName = function(name)
	{
		var newName = name;
		try
		{
			// 查询对象的构建
			var queryObj = new Activity();
			// 按活动名称查询
			queryObj.activity_name = name;
			queryObj.queryOption.equalOrLike = Constants.sql.like;
			var results = queryObj.queryByPageInfo();
			if(results != null && results.length > 0) {
				newName = results[0].activity_name + Constants.activity.nameMark;
			}
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0007');
		}
		return newName;
	}


	/** 根据活动ID取得活动人员信息
	  * id ： 活动信息
	  * return : 人员信息数组
	  */
	Activity.getMembers = function(id)
	{
		var members = [];
		var fields = ["id", "name", "email", "friend_number", "pay_pattern", "pay_pattern_info", "pay_number"];
		try
		{
			members = DBUtil.queryBySql(Activity.getMembersSql(id), fields);
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0006');
		}

		return members;
	}

	// 取得人员信息sql文的取得
	Activity.getMembersSql = function(id) {
		var strSql;
		strSql = "select ";
		strSql += "a.people_id as id, ";
		strSql += "p.people_name as name, ";
		strSql += "p.people_email as email, ";
		strSql += "a.friend_number as friend_number, ";
		strSql += "a.pay_pattern as pay_pattern, ";
		strSql += "a.pay_pattern_info as pay_pattern_info, ";
		strSql += "a.pay_number as pay_number ";
		strSql += "from t_activity_people a, t_people p ";
		strSql += "where a.people_id = p.people_id "
		strSql += "and a.activity_id=" + id;
		return strSql;
	}

	//////////////////////////////////////////////////////////
	///               对象方法部分                           ///
	//////////////////////////////////////////////////////////


	// 取得插入语句
	Activity.prototype.getInsertMemberSqls = function()
	{
		var strSqls = [];
		var strSql;
		LoggerWrapper.debug("[Activity.prototype.getInsertMemberSqls] activity_members.length : " + this.activity_members.length);
		for(var i=0; i<this.activity_members.length; i++) {
			strSql = "INSERT INTO " + Activity.TABLENAME2 + " VALUES(";
			strSql += "'" + this.activity_id + "',";
			strSql += "'" + this.activity_members[i].id + "',";
			strSql += "'" + this.activity_members[i].pay_pattern + "',";
			strSql += "'" + this.activity_members[i].pay_pattern_info + "',";
			strSql += "'" + this.activity_members[i].friend_number + "',";
			strSql += "'" + this.activity_members[i].pay_number + "'";
			strSql += ")";
			strSqls.push(strSql);
		}
		return strSqls;
	}


	// 取得插入语句
	Activity.prototype.getInsertSqls = function()
	{
		var strSqls = [];
		var strSql = "insert into " + Activity.TABLENAME + "("
			+ "activity_id, " 
			+ "activity_name, "
			+ "activity_kind, "
			+ "activity_date, "
			+ "activity_cost, "
			+ "activity_status, "
			+ "activity_memo, "
			+ "activity_info1, "
			+ "activity_info2, "
			+ "activity_info3, "
			+ "activity_info4, "
			+ "activity_info5 "
			+ ") values ("
			+ "'" + this.activity_id + "', "
			+ "'" + this.activity_name + "', "
			+ "'" + this.activity_kind + "', "
			+ "'" + this.activity_date + "', "
			+ "'" + this.activity_cost + "', "
			+ "'" + this.activity_status + "', "
			+ "'" + this.activity_memo + "', "
			+ "'" + this.activity_info1 + "', "
			+ "'" + this.activity_info2 + "', "
			+ "'" + this.activity_info3 + "', "
			+ "'" + this.activity_info4 + "', "
			+ "'" + this.activity_info5 + "');";
		strSqls.push(strSql);
		strSqls = strSqls.concat(this.getInsertMemberSqls());
		return strSqls;
	}

	// 插入方法
	Activity.prototype.insert = function()
	{
		try
		{
			if(this.activity_id == null || this.activity_id == '') {
				this.activity_id = Activity.getNextActivityId();
			}
			

			LoggerWrapper.debug("[Activity.prototype.insert] The next ActivityId is : " + this.activity_id);
			LoggerWrapper.debug("[Activity.prototype.insert] The Insert Sqls : " + Util.arrToString(this.getInsertSqls()));
			DBUtil.executeSqls(this.getInsertSqls());
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0002');
		}
	}

	// 取得更新语句
	Activity.prototype.getUpdateSqls = function()
	{
		var strSqls = [];
		
		var strSql = "update " + Activity.TABLENAME + " set ";
		strSql += "activity_name='" + this.activity_name + "',"; 
		strSql += "activity_kind='" + this.activity_kind + "',"; 
		strSql += "activity_date='" + this.activity_date + "',"; 
		strSql += "activity_cost='" + this.activity_cost + "',"; 
		strSql += "activity_status='" + this.activity_status + "',"; 
		strSql += "activity_memo='" + this.activity_memo + "',"; 
		strSql += "activity_info1='" + this.activity_info1 + "',"; 
		strSql += "activity_info2='" + this.activity_info2 + "',"; 
		strSql += "activity_info3='" + this.activity_info3 + "',"; 
		strSql += "activity_info4='" + this.activity_info4 + "',"; 
		strSql += "activity_info5='" + this.activity_info5 + "'"; 
		strSql += " WHERE activity_id='" + this.activity_id + "'";
		strSqls.push(strSql);
		strSqls.push("DELETE FROM t_activity_people WHERE activity_id='" + this.activity_id + "'");
		strSqls = strSqls.concat(this.getInsertMemberSqls());
		LoggerWrapper.debug("[Activity.prototype.getUpdateSqls] The UpdateSqls:" + Util.arrToString(strSqls));
		return strSqls;
	}

	// 取得更改t_people表中余额信息的sql语句
	Activity.prototype.getUpdateBalanceSqls = function()
	{
		var strSqls = [];
		var strSql;
		for(var i=0; i<this.activity_members.length; i++) {
			strSql = "update " + People.TABLENAME + " set ";
			strSql += "account_balance = account_balance-" + this.activity_members[i].pay_number;
			strSql += " where people_id='" + this.activity_members[i].id + "' ";
			strSqls.push(strSql);
		}
		return strSqls;
	}

	// 取得更新当前活动信息，以及修改余额信息sql语句
	Activity.prototype.getUpdatePaySqls = function()
	{
		var strSqls = [];
		strSqls = strSqls.concat(this.getUpdateSqls());
		strSqls = strSqls.concat(this.getUpdateBalanceSqls());
		return strSqls;
	}

	// 更新余额方法（即点击结算后的DB处理）
	Activity.prototype.updatePayInfo = function()
	{
		try
		{
			DBUtil.executeSqls(this.getUpdatePaySqls());
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0003');
		}
	}


	// 更新方法
	Activity.prototype.update = function()
	{
		try
		{
			DBUtil.executeSqls(this.getUpdateSqls());
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0003');
		}
	}

	/** 根据页面信息，查询对应页面的结果
	  * pageInfo ： 当前页面信息
	  × return : 结果数组
	  */
	Activity.prototype.queryByPageInfo = function(pageInfo)
	{
		var results = [];
		try
		{
			results = DBUtil.query( Activity.FIELDS,
									Activity.TABLENAME,
									this.getQueryConditionSql(),
									' ORDER BY activity_date desc, activity_name desc',
									null,
									pageInfo);
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0005');
		}

		return results;
	}

	/** 取得查询结果数量
	  *
	  */
	Activity.prototype.getCount = function()
	{
		var count = 0;
		try
		{
			count = DBUtil.queryCount(Activity.TABLENAME,	this.getQueryConditionSql());
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0008');
		}

		return count;
	}


	// 取得查询条件
	Activity.prototype.getQueryConditionSql = function()
	{
		var strTemp = "";
		var isEqual = false;
		var strSql = "";
		
		if(this.queryOption.andOr == Constants.sql.and) {
			strSql = " WHERE 1=1 ";
		} else {
			strSql = " WHERE 1<>1 ";
		}
		
		if(this.queryOption.equalOrLike == Constants.sql.equal) {
			isEqual = true;
		}
			
		if(this.activity_id != null) {
			strTemp = (isEqual ? this.activity_id : this.activity_id + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " activity_id ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.activity_name != null) {
			strTemp = (isEqual ? this.activity_name : '%' + this.activity_name + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " activity_name ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.activity_date != null) {
			strTemp = (isEqual ? this.activity_date.substr(0, 10) : '%' + this.activity_date + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " substr(activity_date, 1,10) ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.activity_kind != null) {
			strTemp = this.activity_kind;
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " activity_kind ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.activity_status != null) {
			strTemp = this.activity_status;
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " activity_status ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}

		LoggerWrapper.debug("[Activity.prototype.getQueryConditionSql] Activity.getQueryConditionSql:" + strSql);
		return strSql;
	}


	// toString方法
	Activity.prototype.toString = function()
	{
		var str;
		str = "BaseInfo [ ";
		str += "activity_id : " + this.activity_id + ", ";
		str += "activity_name : " + this.activity_name + ", ";
		str += "activity_kind : " + this.activity_kind + ", ";
		str += "activity_date : " + this.activity_date + ", ";
		str += "activity_cost : " + this.activity_cost + ", ";
		str += "activity_status : " + this.activity_status + ", ";
		str += "activity_memo : " + this.activity_memo + ", ";
		str += "activity_info1 : " + this.activity_info1 + ", ";
		str += "activity_info2 : " + this.activity_info2 + ", ";
		str += "activity_info3 : " + this.activity_info3 + ", ";
		str += "activity_info4 : " + this.activity_info4 + ", ";
		str += "activity_info5 : " + this.activity_info5;	
		str += " ]\r\n";
		str += "MemberInfo(peopleId) [";
		for(var i=0; i<this.activity_members.length; i++) {
			str += this.activity_members[i].id + ",";
		}
		str += " ]";
		return str;
	}
	
	return Activity;
});