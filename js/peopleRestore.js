define(function(require, exports, module) {

	require('../jquery-easyui/themes/icon.css');
	
	var LoggerWrapper = require('./LoggerWrapper.js');
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var Util = require('./Util.js');
	var DBUtil = require('./DBUtil.js');
	var People = require('./People.js');
	
	ActivityToolSystem.init();

	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	$(function(){
		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;
		
		$('#peopleList').datagrid({
			title: '逻辑删除人员一览',
			iconCls: 'icon-save',
			width: 700,
			height: 350,
			nowrap: false,
			striped: true,
			collapsible: false,
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
					},
					formatter : function(value) {
						if(value != null && (value+'') != '') {
							return Util.formatMoney(value); 
						}
						return '';
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
			pagination:true,
			rownumbers:true,
			toolbar:[{
				id:'btnRestore',
				text:'恢复',
				iconCls:'icon-edit',
				handler:btnRestore_click
			}]
		});

		// 初始化时候加载数据
		$('#peopleList').datagrid("loadData", getPageData(Constants.initPageInfo, getQueryObject()));

		// 取得分页控件
		var p = $('#peopleList').datagrid('getPager');
		if (p){
			$(p).pagination({
				onSelectPage: function(pageNumber, pageSize){
					// 取得当前页面的信息
					var pageInfo = {currentPage:pageNumber, pageSize:pageSize};
					// 加载指定页面数据				
					$('#peopleList').datagrid("loadData", getPageData(pageInfo, getQueryObject()));
					// 清除所有的选择
					$('#peopleList').datagrid('clearSelections');
				}
			});
		}
		
		// 绑定画面的事件
		$('#btnSearch').click(btnSearch_click);
		
	});


	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	// 查询button按下处理
	function btnSearch_click(){
		var strQuery = $('#txtCondition').val().trim();
		$('#txtCondition').val(strQuery);
		// 页面刷新
		refreshData(Constants.initPageInfo);
	}

	// 恢复button按下处理
	function btnRestore_click(){
		var f = restoreProcess;
		var noSelectionStr = Message.W_C_00_000_0001.replace('{0}', '恢复');
		processSelections(f, 2, noSelectionStr);
	}


	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////

	// 取得查询用对象
	function getQueryObject() {
		var p = null;
		var strQuery = $('#txtCondition').val().trim();
		if(strQuery != '') {
			// 检索条件的构造
			p = new People(strQuery, strQuery);
			// 查询已经删除的记录
			p.deleteflag = Constants.deleteFlag.deleted;
			p.queryOption.andOr = Constants.sql.or;
			p.queryOption.equalOrLike = Constants.sql.like;
		} else {
			p = new People();
			// 查询已经删除的记录
			p.deleteflag = Constants.deleteFlag.deleted;
		}
		return p;
	}

	// 根据页面信息取得指定页面的数据
	function getPageData(pageInfo, people){
		var p;
		if(people) {
			p = people;
		} else {
			p = new People();
		}
		// 取得总记录数
		var count = p.getCount();
		// 取得指定页的数据
		var results = p.queryByPageInfo(pageInfo);
		var dataList = {                                                      
			"total" : count,
			"rows" : results
		};
		return dataList;
	}

	// 恢复处理
	function restoreProcess(selections) {
		alert('selections.length = ' + selections.length);
		if(selections && selections.length > 0) {
			// 取得所有选择ID的集合
			var ids = [];
			for(var i=0; i<selections.length; i++){
				ids.push(selections[i].id);
			}
			var str = Message.I_C_00_000_0004;
			str += '<br />';
			str += ids.join(' : ');
			var f = function(r) {
				if(r) {
					var strDelete = 'UPDATE t_people SET delete_flag = 0 WHERE people_id IN (' + ids.join(',') + ')';
					try
					{
						// 执行删除语句
						DBUtil.executeSql(strDelete);
						// 恢复成功处理
						ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005,
							msg : Message.I_C_00_000_0002.replace('{0}', ids.join(' : ')).replace('{1}', '恢复')
						});
						// 画面刷新处理
						refreshData();
					}
					catch (ex)
					{
						LoggerWrapper.error(ex);
						throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0011');
					}
				}
			}

			// 弹出确认框
			$.messager.confirm(Message.T_C_00_000_0002, str, f);
		}
	}

	// 对选择的按钮进行提示处理
	// funProcessRecord : 选择确认后的处理函数
	// mode : 给处理函数传递参数模式 1:传递选择的第一个记录 2:不提示警告,传递选择的记录集合
	// noSelectionStr : 没有选择记录时候的提示信息
	// mulSelectionStr : 选择多条记录时候的提示信息
	function processSelections(funProcessRecord, mode, noSelectionStr, mulSelectionStr) {
		// 选择的记录集和
		var selections = Util.getDataGridSelections('#peopleList');
		// 第一个选择的记录
		var p = Util.getDataGridSelected('#peopleList');
		if(selections == null || selections.length == 0) {
			// 没有选择的场合
			$.messager.alert(Message.T_C_00_000_0001, noSelectionStr, 'error');
			return;
		}
		
		if(mode == 2) {
			funProcessRecord(selections);
			return;
		}
		
		if(selections.length == 1) {
			// 选择了一条记录的场合
			funProcessRecord(p);
			return;
		}
		if(selections.length > 1) {
			// 选择了多条记录的场合
			var str = mulSelectionStr.replace('{0}', p.id);
			var f = function(r) {
				if (r){
					funProcessRecord(p);
				}
			};
			
			// 弹出确认框
			$.messager.confirm(Message.T_C_00_000_0002, str, f);
			return;
		}
	}

	// 列表刷新处理
	// updPageInfo : 要进行设定的Page信息（将当前页设置为参数的页）
	function refreshData(updPageInfo) {
		var p = $('#peopleList').datagrid('getPager');
		if(p) {
			if(updPageInfo) {
				p.pagination('options').pageNumber = updPageInfo.currentPage;
			}
			var pageInfo = {currentPage: p.pagination('options').pageNumber,
							pageSize: p.pagination('options').pageSize};
			// 加载指定页面数据				
			$('#peopleList').datagrid("loadData", getPageData(pageInfo, getQueryObject()));
			// 清除所有的选择
			$('#peopleList').datagrid('reload');
		}
	}

});