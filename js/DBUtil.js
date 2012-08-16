define(function(require, exports, module) {

	var LoggerWrapper = require('./LoggerWrapper.js');

	// The Util to process DB
	var DBUtil = {
		dbPath : "e:\\01_moyan\\00_moyan_SugarSync\\05_MyProject\\ActivityTool\\03_source\\database\\ActivityTool.db",
		getConnection : getConnection,
		executeSql : executeSql,
		executeSqls : executeSqls,
	    query : query,
		queryCount : queryCount,
		queryBySql : queryBySql
	};

	// Get the path of DB File
	function getDBPath()
	{
		// Document URL
		var docURL = document.URL;
		var pathSep = '/';
		var dbPath;
		// [:]`s index
		var startIndex;
		// last index of pathSeq
		var endIndex;

		if(docURL.indexOf('\\') != -1)
		{
			pathSep = '\\';
		}
		// start index from the Drive :
		startIndex = docURL.lastIndexOf(':') - 1;
		endIndex = docURL.lastIndexOf(pathSep) + 1;
		dbPath = docURL.substring(startIndex, endIndex) + "database" + pathSep;
		dbPath = dbPath.replace(/\\/g, '\\\\');
		dbPath = dbPath + "ActivityTool.db;"
		return dbPath;
	}

	// Get the DB connection
	function getConnection()
	{
		var   conn   =   new   ActiveXObject( "ADODB.Connection"); 
	//	conn.ConnectionString= "Driver=SQLite3 ODBC Driver;Database=" + getDBPath();
		conn.ConnectionString= "Driver=SQLite3 ODBC Driver;Database=" + DBUtil.dbPath;
		conn.Open();
		return conn;
	}

	// Execute sql of insert, update, delete
	function executeSql(strSql)
	{
		var conn = DBUtil.getConnection();
		LoggerWrapper.debug("[executeSql] " + strSql);
		conn.execute(strSql);
		// Close the DB connection
		conn.Close();
		conn = null;
	}


	// 执行多条SQL语句（事务）
	function executeSqls(strSqls)
	{
		if(strSqls != null && strSqls.length > 0) {
			var conn = DBUtil.getConnection();
			// 开始事务
			conn.BeginTrans();
			try {
				for(var i=0; i<strSqls.length; i++) {
					conn.execute(strSqls[i]);			
				}
				// 提交事务
				conn.CommitTrans();
			} catch(ex) {
				// 回滚事务
				conn.RollbackTrans();
				throw ex;
			} finally {
				// Close the DB connection
				conn.Close();
				conn = null;
			}
		}
	}


	function queryCount(tableName, condition)
	{
	    // TODO parameter check
		var conn = DBUtil.getConnection();
	    var rs = new ActiveXObject("ADODB.recordset");
	    var count = 0;
	    var strSql = "SELECT count(*) c FROM " + tableName;

	    // if condition passed
	    if(condition)
		{
	        strSql += " " + condition;
	    }

	    rs.open(strSql, conn);
	    rs.MoveFirst();
		
		count = rs('c').Value;

	    // Close The RecordSet
	    rs.Close();
	    rs = null;
	    // Close The Connection
		conn.Close();
		conn = null;
	    return count;
	}



	/** content : execute select and return select results
	  * param   : fields, string[], query field`s id
	  * param   : tableName, string, table`s name
	  * param   : condition, string, query condition
	  * param   : fieldsAlias, string[], field`s alias
	  * return  : Array(Object), the query result
	  */
	function query(fields, tableName, condition, sortString, fieldsAlias, pageInfo)
	{
	    // TODO parameter check
		var conn = DBUtil.getConnection();
	    var rs = new ActiveXObject("ADODB.recordset");
	    var results = new Array();
	    var strSql = "SELECT ";
	    var i = 0;

	    // Get the query sql
	    for(i = 0; i < fields.length-1; i++)
		{
	        strSql += fields[i] + ",";
	    }
	    strSql += fields[fields.length-1];
	    strSql += " FROM " + tableName;
	    // if condition passed
	    if(condition)
		{
	        strSql += " " + condition;
	    }
	    // if sortString passed
	    if(sortString)
		{
	        strSql += " " + sortString;
	    }

		if(pageInfo) {
			
			strSql += " limit " + (pageInfo.currentPage-1)*pageInfo.pageSize + "," + pageInfo.pageSize;
		}

	    rs.open(strSql, conn);
		if(rs.EOF != true) {
		    rs.MoveFirst();
		}
	    while (rs.EOF != true) 
	    {
	        var obj = new Object();
	        for(i = 0; i < fields.length; i++)
	        {
				if(typeof fieldsAlias != "undefined" && fieldsAlias != null)
				{
		            obj[fieldsAlias[i]] = rs(fields[i]).Value;
				} else {
		            obj[fields[i]] = rs(fields[i]).Value;
				}
	        }
	        results.push(obj);
	        rs.MoveNext();
	    }

	    // Close The RecordSet
	    rs.Close();
	    rs = null;
	    // Close The Connection
		conn.Close();
		conn = null;
	    return results;
	}

	// 根据sql语句，返回查询结果数组
	function queryBySql(strSql, fields, fieldsAlias)
	{
	    // TODO parameter check
		var conn = DBUtil.getConnection();
	    var rs = new ActiveXObject("ADODB.recordset");
	    var results = new Array();
	    var i = 0;

		LoggerWrapper.debug("[queryBySql] queryBySql:" + strSql);
	    rs.open(strSql, conn);
		if(rs.EOF != true) {
		    rs.MoveFirst();
		}
	    while (rs.EOF != true) 
	    {
	        var obj = new Object();
	        for(i = 0; i < fields.length; i++)
	        {
				if(typeof fieldsAlias != "undefined" && fieldsAlias != null)
				{
		            obj[fieldsAlias[i]] = rs(fields[i]).Value;
				} else {
		            obj[fields[i]] = rs(fields[i]).Value;
				}
	        }
	        results.push(obj);
	        rs.MoveNext();
	    }

	    // Close The RecordSet
	    rs.Close();
	    rs = null;
	    // Close The Connection
		conn.Close();
		conn = null;
	    return results;
	}

	return DBUtil;
});