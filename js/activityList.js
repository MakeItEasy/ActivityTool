define(function(require, exports, module) {

	require('../jquery-easyui/themes/icon.css');
	
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var Util = require('./Util.js');
	var Activity = require('./Activity.js');
	
	ActivityToolSystem.init();
	
	
	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	$(function(){
		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;
		
		<!-- 活动一览窗口页面 -->
		$('#activityListWindow').panel({
			title: '活动一览',
			iconCls: 'icon-save',
			width: 700,
			height: 439	
		});	
		
		$('#activityList').datagrid({
			// 不显示标题和图标,原来的工具栏实现方式
			/*
			title: '活动一览',
			iconCls: 'icon-save',
			width: 700,
			height: 350,
			*/
			width: 698,
			height: 380,
			nowrap: false,
			striped: true,
			collapsible: false,
			sortName: 'activity_date, activity_name',
			sortOrder: 'desc',
			remoteSort: false,
			idField:'activity_id',
			singleSelect : true,

			frozenColumns:[[
				{field: 'ck', checkbox: true},
				{field:'activity_id', title:'活动编号', hidden:true}
			]],
			columns:[[
				{field:'activity_name',title:'活动名称',width:180,sortable:true},
				{field:'activity_date',title:'活动日期',width:180	, sortable:true},
				{field:'activity_kind',title:'活动类别',width:80, formatter : function(value) {
						for(var i=0; i<Constants.activityKind.length; i++) {
							if(Constants.activityKind[i].id == value) {
								return Constants.activityKind[i].text;
							}
						}
						return '';
					}
				},
				{field:'activity_status',title:'活动状态',width:100, sortable:true, formatter : function(value) {
						return '<span class="' + Constants.activity.status[value].icon + '" style="padding-left:20px;">'
								+ Constants.activity.status[value].msg + '</span>';
					}
				},
				{field:'activity_cost',title:'活动费用',width:80}
			]],
			border : false ,
			pagination:true,
			rownumbers:true
			// 屏蔽掉此种工具栏方式，因为这种方式无法再hta里面实现跳转
			/*
			toolbar:[{
				id:'btnAdd',
				text:'新建',
				iconCls:'icon-add',
				handler:btnAdd_click
			},{
				id:'btnEdit',
				text:'更新',
				iconCls:'icon-edit',
				handler:btnEdit_click
			},{
				id:'btnCopy',
				text:'复制',
				iconCls:'icon-remove',
				handler:btnCopy_click
			},'-']
			*/
		});

		// 取得分页控件
		var p = $('#activityList').datagrid('getPager');
		if (p){
			$(p).pagination({
				onSelectPage: function(pageNumber, pageSize){
					// 取得当前页面的信息
					var pageInfo = {currentPage:pageNumber, pageSize:pageSize};
					// 加载指定页面数据				
					$('#activityList').datagrid("loadData", getPageData(pageInfo, getQueryObject()));
					// 清除所有的选择
					$('#activityList').datagrid('clearSelections');
				}
			});
		}
		
		// 初始化时候加载数据
		$('#activityList').datagrid("loadData", getPageData(Constants.initPageInfo));
		
		// 绑定页面的各个事件
		$('#btnAdd').click(btnAdd_click);
		$('#btnEdit').click(btnEdit_click);
		$('#btnCopy').click(btnCopy_click);
		
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

	// 新建button按下处理
	function btnAdd_click(){
		// 新建活动
		window.parent.ActivitySystem.publicParam.updateActivityId = null;
		window.location.href = "activityNew.html";
	}

	// 更新button按下处理
	function btnEdit_click(){
		// 更新活动
		// 选择的记录
		var act = Util.getDataGridSelected('#activityList');
		if(act == null) {
			// 没有选择的场合
			$.messager.alert(Message.T_C_00_000_0001, Message.W_C_00_000_0001.replace('{0}', '更新'), 'error');
			return;
		}
		// 全局参数的设定
		window.parent.ActivitySystem.publicParam.updateActivityId = act.activity_id;
		window.parent.ActivitySystem.publicParam.isCopyActivity = false;
		// 页面迁移
		window.location.href = "activityNew.html";
	}

	// 复制button按下处理
	function btnCopy_click() {
		// 更新活动
		// 选择的记录
		var act = Util.getDataGridSelected('#activityList');
		if(act == null) {
			// 没有选择的场合
			$.messager.alert(Message.T_C_00_000_0001, Message.W_C_00_000_0001.replace('{0}', '复制'), 'error');
			return;
		}
		// 全局参数的设定
		window.parent.ActivitySystem.publicParam.updateActivityId = act.activity_id;
		window.parent.ActivitySystem.publicParam.isCopyActivity = true;
		// 页面迁移
		window.location.href = "activityNew.html";
	}



	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////

	// 取得查询用对象
	function getQueryObject() {
		var act = null;
		var strQuery = $('#txtCondition').val().trim();
		if(strQuery != '') {
			// 检索条件的构造
			act = new activity();
			// act.queryOption.andOr = Constants.sql.or;
			// act.queryOption.equalOrLike = Constants.sql.like;
		}
		return act;
	}

	// 根据页面信息取得指定页面的数据
	function getPageData(pageInfo, activity){
		var act;
		if(activity) {
			act = activity;
		} else {
			act = new Activity();
		}
		// 取得总记录数
		var count = act.getCount();
		// 取得指定页的数据
		var results = act.queryByPageInfo(pageInfo);
		var dataList = {                                                      
			"total" : count,
			"rows" : results
		};
		return dataList;
	}

	// 列表刷新处理
	// updPageInfo : 要进行设定的Page信息（将当前页设置为参数的页）
	function refreshData(updPageInfo) {
		var p = $('#activityList').datagrid('getPager');
		if(p) {
			if(updPageInfo) {
				p.pagination('options').pageNumber = updPageInfo.currentPage;
			}
			var pageInfo = {currentPage: p.pagination('options').pageNumber,
							pageSize: p.pagination('options').pageSize};
			// 加载指定页面数据				
			$('#activityList').datagrid("loadData", getPageData(pageInfo, getQueryObject()));
			// 清除所有的选择
			$('#activityList').datagrid('clearSelections');
		}
	}

	// 对选择的按钮进行提示处理
	// funProcessRecord : 选择确认后的处理函数
	// mode : 给处理函数传递参数模式 1:传递选择的第一个记录 2:不提示警告,传递选择的记录集合
	// noSelectionStr : 没有选择记录时候的提示信息
	// mulSelectionStr : 选择多条记录时候的提示信息
	function processSelections(funProcessRecord, noSelectionStr) {
		// 选择的记录
		var act = Util.getDataGridSelected('#activityList');
		if(act == null) {
			// 没有选择的场合
			$.messager.alert(Message.T_C_00_000_0001, noSelectionStr, 'error');
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

});