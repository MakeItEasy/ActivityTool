define(function(require, exports, module) {
	/** 
	  * 依赖性 : 无
	  */

	var Constants = {};

	// 回车换行符号
	Constants.enterKey = "\r\n";

	// 初始化的页面信息
	Constants.initPageInfo = {
		currentPage : 1,
		pageSize : 10
	};

	// 提示窗口的显示属性
	Constants.showInfoWindow = {
		showTime : 4000,
		showType : 'slide'
	};

	// 性别定义
	Constants.sex = {
		male : '男',
		female : '女'
	};

	// 余额警告限度（小于这个值背景变红）
	Constants.balanceWaring = {
		limitValue : 3,
		styler : 'background:red'
	};

	// 关于删除标志位
	Constants.deleteFlag = {
		deleted : 1,
		notDeleted : 0
	};

	// 是和否
	Constants.yesAndNo = {
		yes : 1,
		no : 0
	};

	Constants.yesAndNo.info = {
		yes : '是',
		no : '否'
	};

	// SQL关键字定义
	Constants.sql = {
		and : 'AND',
		or : 'OR',
		equal : '=',
		like : 'LIKE'
	};
					
					
	// 日期格式
	Constants.dataFormat = {
		db : 'yyyy-MM-dd hh:mm:ss',		// 向DB插入时候的日期格式，不要修改
		view : 'yyyy-MM-dd hh:mm:ss'
	};

	// 错误Number定义
	Constants.errorNumber = {
		defaultNumber : 100
	};

	// 活动种类信息
	Constants.activityKind = [
		{"id":1, "text":"羽毛球"},
		{"id":2, "text":"聚餐"}
	];

	// 活动种类信息
	Constants.activityPayPattern = [
		{patternId : 1, patternName : "折扣方式"},
		{patternId : 2, patternName : "现金方式"}
	];

	// 活动相关的各项参数
	Constants.activity = {
		// 默认时间
		defaultActivityTime : '18:00:00',
		// 活动名称格式
		namePattern : '[%d]%n活动',
		// 默认显示场地数量
		defaultPlaceNumber : 2,
		defaultFriendNumber : 0,
		defaultPayPattern : 1,
		defaultPayPatternInfo : 1,
		status : {
			1 : {icon : 'icon-notVisited', msg : '未邀请', confirmText : ''},
			2 : {icon : 'icon-sendmail', msg : '已邀请',  confirmText : '邀请'},
			3 : {icon : 'icon-makesure', msg : '已确认',  confirmText : '确认'},
			4 : {icon : 'icon-coins', msg : '已结算',  confirmText : '结算'},
			5 : {icon : 'icon-sad', msg : '已取消',  confirmText : '取消'}
		},
		nameMark : '#'
	};

	// 星期的表示方式，以后想修改表达方式就修改这里
	Constants.weekday = new Array(7);
	Constants.weekday[0]="星期日";
	Constants.weekday[1]="星期一";
	Constants.weekday[2]="星期二";
	Constants.weekday[3]="星期三";
	Constants.weekday[4]="星期四";
	Constants.weekday[5]="星期五";
	Constants.weekday[6]="星期六";

	return Constants;

});
