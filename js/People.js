define(function(require, exports, module) {

	var LoggerWrapper = require('./LoggerWrapper.js');
	var Constants = require('./Constants.js');
	var DBUtil = require('./DBUtil.js');
	
	//////////////////////////////////////////////////////////
	///               构造函数部分                           ///
	//////////////////////////////////////////////////////////
	function People(pId, pName, pSex, pEmail, pBalance, pJoin, pRecivemail, pDeleteflag)
	{
		this.id = pId;
		this.name = pName;
		this.sex = pSex;
		this.email = pEmail;
		this.balance = pBalance;
		this.join = pJoin;
		this.recivemail = pRecivemail;
		if(pDeleteflag) {
			this.deleteflag = pDeleteflag;
		} else {
			this.deleteflag = Constants.deleteFlag.notDeleted;
		}
		this.queryOption = {andOr : Constants.sql.and, equalOrLike : Constants.sql.equal};
	}

	//////////////////////////////////////////////////////////
	///               类常量部分                            ///
	//////////////////////////////////////////////////////////
	// 操作表名
	People.TABLENAME = "t_people";
	People.FIELDS = ['people_id', 'people_name', 'people_sex', 'people_email', 'account_balance', 'default_join', 'default_recivemail', 'delete_flag'];
	People.FIELDSALIAS = ['id', 'name', 'sex', 'email', 'balance', 'join', 'recivemail', 'deleteflag'];


	//////////////////////////////////////////////////////////
	///               类方法部分                            ///
	//////////////////////////////////////////////////////////

	People.queryNotIncludeIds = function(arrIds, appendReciveMailFlag)
	{
		var strSql = "SELECT ";
		strSql += People.FIELDS.join(' , ');
		strSql += " FROM " + People.TABLENAME;
		strSql += " WHERE delete_flag='" + Constants.deleteFlag.notDeleted + "'";
		
		if(appendReciveMailFlag) {
			strSql += " AND default_recivemail = '1'";
		}
		if(arrIds != null && arrIds.length > 0) {
			strSql += " AND people_id not in (" + arrIds.join(" , ") + ")";
		}
		strSql += " ORDER BY people_id ASC";
		
		
		var results = [];
		try
		{
			results = DBUtil.queryBySql(strSql, People.FIELDS, People.FIELDSALIAS);
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0006');
		}

		return results;
	}

	People.queryIncludeIds = function(arrIds, appendReciveMailFlag)
	{
		var strSql = "SELECT ";
		strSql += People.FIELDS.join(' , ');
		strSql += " FROM " + People.TABLENAME;
		strSql += " WHERE delete_flag='" + Constants.deleteFlag.notDeleted + "'";
		strSql += " AND ( 1<>1 ";
		
		if(appendReciveMailFlag) {
			strSql += " OR default_recivemail = '1'";
		}
		if(arrIds != null && arrIds.length > 0) {
			strSql += " OR people_id in (" + arrIds.join(" , ") + ")";
		}
		strSql += " ) ORDER BY people_id ASC";
		
		
		var results = [];
		try
		{
			results = DBUtil.queryBySql(strSql, People.FIELDS, People.FIELDSALIAS);
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0006');
		}

		return results;
	}


	//////////////////////////////////////////////////////////
	///               对象方法部分                           ///
	//////////////////////////////////////////////////////////

	// 取得查询条件
	People.prototype.getQueryConditionSql = function()
	{
		var strTemp = "";
		var isEqual = false;
		var strSql = "";
		
		if(this.queryOption.andOr == Constants.sql.and) {
			strSql = " WHERE (1=1 ";
		} else {
			strSql = " WHERE (1<>1 ";
		}
		
		if(this.queryOption.equalOrLike == Constants.sql.equal) {
			isEqual = true;
		}
			
		if(this.id != null) {
			strTemp = (isEqual ? this.id : this.id + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " people_id ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.name != null) {
			strTemp = (isEqual ? this.name : '%' + this.name + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " people_name ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.sex != null && isEqual) {
			strTemp = this.sex;
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " people_sex ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}

		if(this.email != null) {
			strTemp = (isEqual ? this.email : '%' + this.email + '%');
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " people_email ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.join != null && isEqual) {
			strTemp = this.join;
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " default_join ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		if(this.recivemail != null && isEqual) {
			strTemp = this.recivemail;
			strSql += " ";
			strSql += this.queryOption.andOr;
			strSql += " default_recivemail ";
			strSql += this.queryOption.equalOrLike;
			strSql += " '" + strTemp + "'";
			strSql += " ";
		}
		
		// 后括号的追加
		strSql += ") ";
		
		// 删除标志位的处理	
		strTemp = this.deleteflag != null ? this.deleteflag : '0';
		strSql += " ";
		strSql += Constants.sql.and;
		strSql += " (delete_flag ";
		strSql += Constants.sql.equal;
		strSql += " '" + strTemp + "'";
		strSql += ") ";

		
		LoggerWrapper.debug("[People.prototype.getQueryConditionSql] People.getQueryConditionSql:" + strSql);
		return strSql;
	}

	// 取得插入语句
	People.prototype.getInsertSql = function()
	{
		var strSql = "insert into t_people("
			+ "people_id, " 
			+ "people_name, "
			+ "people_sex, "
			+ "people_email, "
			+ "account_balance, "
			+ "default_join, "
			+ "default_recivemail, "
			+ "delete_flag "
			+ ") values ("
			+ "'" + this.id + "', "
			+ "'" + this.name + "', "
			+ "'" + this.sex + "', "
			+ "'" + this.email + "', "
			+ "'0', "
			+ "'" + this.join + "', "
			+ "'" + this.recivemail + "', "
			+ "'0');";
		return strSql;
	}

	// 插入方法
	People.prototype.insert = function()
	{
		var queryResult = People.queryById(this.id);
		if(queryResult != null)
		{
			if(queryResult.deleteflag == Constants.deleteFlag.notDeleted)
			{
				throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0008');
			}
			else
			{
				throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0009');
			}
		}	
		else
		{
			try
			{
				DBUtil.executeSql(this.getInsertSql());	
			}
			catch (ex)
			{
				LoggerWrapper.error(ex);
				throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0001');
			}
		}
	}

	// 取得更新语句
	People.prototype.getUpdateSql = function()
	{
		var strSql = "update t_people set "
			+ "people_name = '" + this.name + "', "
			+ "people_sex = '" + this.sex + "', "
			+ "people_email = '" + this.email + "', "
			+ "account_balance = '" + this.balance + "', "
			+ "default_join = '" + this.join + "', "
			+ "default_recivemail = '" + this.recivemail + "', "
			+ "delete_flag = '" + this.deleteflag + "' "
			+ "where people_id = '" + this.id + "';"
		return strSql;
	}

	// 更新方法
	People.prototype.update = function()
	{
		try
		{
			DBUtil.executeSql(this.getUpdateSql());	
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0002');
		}
	}

	// 取得删除语句
	People.prototype.getDeleteSql = function()
	{
		var strSql = "update t_people set "
			+ "delete_flag = '" +  Constants.deleteFlag.deleted + "' "
			+ "where people_id = '" + this.id + "';"
		return strSql;
	}

	// 删除方法
	People.prototype.del = function()
	{
		try
		{
			DBUtil.executeSql(this.getDeleteSql());	
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0003');
		}
	}

	// 根据主键（ID）查询
	// return : 查到的People对象，不存在时返回null
	People.prototype.queryByKey = function()
	{
		var results = null;
		var person = null;
		try
		{
			results = this.queryByPageInfo();
			
			if(results != null && results.length > 0)
			{
				person = results[0];
			}
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0005');
		}

		return person;
	}


	/** 根据页面信息，查询对应页面的结果
	  * pageInfo ： 当前页面信息
	  * return : 结果数组
	  */
	People.prototype.queryByPageInfo = function(pageInfo)
	{
		var results = [];
		try
		{
			results = DBUtil.query( People.FIELDS,
									People.TABLENAME,
									this.getQueryConditionSql(),
									' ORDER BY PEOPLE_ID ASC',
									People.FIELDSALIAS,
									pageInfo);
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0006');
		}

		return results;
	}

	/** 取得查询结果数量
	  *
	  */
	People.prototype.getCount = function()
	{
		var count = 0;
		try
		{
			count = DBUtil.queryCount(People.TABLENAME,	this.getQueryConditionSql());
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0007');
		}

		return count;
	}
	
	/** 根据ID取得查询结果
	  * param	: id, int, people id
	  * return	: when exist : People Object
	  * 		  when not exist : null
	  */
	People.queryById = function(id)
	{
		var results = [];
		var person = null;
		var strConditionSql = "";
		
		if(id != null) {
			strConditionSql = " WHERE people_id = '" + id + "'";
		} else {
			LoggerWrapper.error("Param Error");
			return null;
		}		
		
		try
		{
			results = DBUtil.query( People.FIELDS,
									People.TABLENAME,
									strConditionSql,
									' ORDER BY PEOPLE_ID ASC',
									People.FIELDSALIAS);
			if(results != null && results.length > 0)
			{
				person = results[0];
			}
		}
		catch (ex)
		{
			LoggerWrapper.error(ex);
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0006');
		}

		return person;
	}

	// toString方法
	People.prototype.toString = function()
	{
		var str;
		str = "id : " + this.id + ", ";
		str += "name : " + this.name + ", ";
		str += "sex : " + this.sex + ", ";
		str += "email : " + this.email + ", ";
		str += "balance : " + this.balance + ", ";
		str += "join : " + this.join + ", ";
		str += "recivemail : " + this.recivemail + ", ";
		str += "deleteflag : " + this.deleteflag + ", ";
		return str;
	}

	return People;	
});