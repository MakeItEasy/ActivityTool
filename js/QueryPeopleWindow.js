define(function(require, exports, module) {


	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var Constants = require('./Constants.js');

	//////////////////////////////////////////////////////////
	///               构造函数部分                           ///
	//////////////////////////////////////////////////////////

	// 构造函数
	/** windowOptions说明
	  * notInString : The ids for not select
	  */
	function QueryPeopleWindow(opts) {
		this.windowOptions = opts;
		
		<!-- 活动信息页面 -->
		$('#queryPeople').window({
			title: '人员查询',
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

		$('#queryPeopleResultList').datagrid({
			width : 736,
			height: 434,
			nowrap: true,
			striped: true,
			sortName: 'id',
			sortOrder: 'asc',
			remoteSort: false,
			idField:'id',

			frozenColumns:[[
				{field: 'ck', checkbox: true},
				{title:'编号',field:'id',width:40, align:'center', sortable:true,
					sorter:function(a,b){
						return (a-b>0?1:-1);
					}
				}
			]],
			columns:[[
				{field:'name',title:'姓名',width:100, align:'center', sortable:true,
					sorter:function(a,b){
						return (a>b?1:-1);
					}
				},
				{field:'sex',title:'性别',width:40, align:'center', formatter: function(value) {
						return value==0 ? Constants.sex.female : Constants.sex.male;
					}
				},
				{field:'email',title:'Email',width:150},
				{field:'balance',title:'账户余额',width:100,sortable:true,sorter:function(a,b){
						return (a-b>0?1:-1);
					},
					styler: function(value) {
						if(value < Constants.balanceWaring.limitValue) {
							return Constants.balanceWaring.styler;
						}
					}
				},
				{field:'join',title:'参加一切活动',width:90, align:'center', sortable:true, formatter: function(value) {
						return value==Constants.yesAndNo.yes ? Constants.yesAndNo.info.yes : Constants.yesAndNo.info.no;
					}
				},
				{field:'recivemail',title:'接收一切邮件',width:90, align:'center', sortable:true, formatter: function(value) {
						return value==Constants.yesAndNo.yes ? Constants.yesAndNo.info.yes : Constants.yesAndNo.info.no;
					}
				}
			]],
			rownumbers:true
		});

		// 设置选择后的处理函数
		if(opts && opts.afterSelectProcess) {
			QueryPeopleWindow.afterSelectProcess = opts.afterSelectProcess;
		}
		
		$('#queryPeople_ok').click(ok_click);
		$('#queryPeople_cancel').click(cancel_click);
	}


	//////////////////////////////////////////////////////////
	///               对象方法部分                          ///
	//////////////////////////////////////////////////////////
	QueryPeopleWindow.prototype.openWindow= function(arrIds) {
		initWindow(arrIds);
		$('#queryPeople').window('open');
	}

	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	// [确认]click处理
	function ok_click() {
		QueryPeopleWindow.afterSelectProcess($('#queryPeopleResultList').datagrid('getSelections'));
		$('#queryPeople').window('close');

	}

	// [取消]click处理
	function cancel_click() {
		$('#queryPeople').window('close');
	}


	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////


	// 初期显示时处理
	function initWindow(arrIds) {
		// 
		$('#queryPeople_condition').val('');

		// 
		$('#queryPeopleResultList').datagrid("unselectAll");
		
		// 加载数据
		var results = People.queryNotIncludeIds(arrIds);
		
		var dataList = {                                                      
			"total" : results.length,
			"rows" : results
		};
		$('#queryPeopleResultList').datagrid("loadData", dataList);
	}
	
	return QueryPeopleWindow;

});