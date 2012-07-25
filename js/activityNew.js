define(function(require, exports, module) {

	require('../jquery-easyui/themes/icon.css');
	
	var LoggerWrapper = require('./LoggerWrapper.js');
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js');
	var ActivityToolSystem = require('./ActivityToolSystem.js');
	var Constants = require('./Constants.js');
	var Message = require('./Message.js');
	var Util = require('./Util.js');
	var Activity = require('./Activity.js');
	var People = require('./People.js');
	var QueryPeopleWindow = require('./QueryPeopleWindow.js');
	var ActivityCalculator = require('./ActivityCalculator.js');
	var SendMailForm = require('./SendMailForm.js');
	
	var MailHandlerModule = require('./MailHandler.js');
	var MailHandler = MailHandlerModule.MailHandler;
	var WelcomeMailHandler = MailHandlerModule.WelcomeMailHandler;
	var MakesureMailHandler = MailHandlerModule.MakesureMailHandler;
	var CancelMailHandler = MailHandlerModule.CancelMailHandler;
	var PayMailHandler = MailHandlerModule.PayMailHandler;
	
	ActivityToolSystem.init();
	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	var queryPeopleWindow;
	var sendMailForm;

	$(function(){

		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;
		
		// 最后一次编辑的行号
		var lastIndex;
		
		<!-- 活动信息页面 -->
		$('#activityInfo').panel({
			title: '活动信息',
			iconCls: 'icon-save',
			width: 800,
			height: 550	
		});
		
		<!-- 活动基本信息部分 -->
		$('#activityBaseInfo').panel({
			width: 775
		});
		
		<!-- 活动日期输入框 -->
		$('#activity_date').datetimebox({
			width : 215,
			// showSeconds : false,
			editable : false,
			required : true,
			// 默认值
			value : new Date().format('yyyy-MM-dd ' + Constants.activity.defaultActivityTime),
			formatter : function(date){
				return date.format();
			},
			parser : function(strDate) {
				return Date.CreateDateTime(strDate);
			},
			onChange : activityDate_change
		});
		
		<!-- 活动种类选择框 -->
		$('#activity_kind').combobox({
			width : 155,
			editable : false,
			required : true,
			data : Constants.activityKind,
			valueField : 'id',
			textField : 'text',
			value : 1,
			panelHeight : "auto",
			onSelect : activityKind_select
		});
			
		<!-- 参加活动人员信息部分 -->
		$('#peopleList').datagrid({
			title: '参加活动人员一览(双击进行编辑)',
			width: 775,
			height: 320,
			nowrap: false,
			striped: true,
			collapsible: false,
			sortName: 'id',
			sortOrder: 'asc',
			remoteSort: false,
			idField:'id',
			frozenColumns:[[
				{field: 'ck', checkbox: true,rowspan:2},
				{title:'人员编号',field:'id',width:70,rowspan:2, align:'center', sortable:true,
					sorter:function(a,b){
						return (a-b>0?1:-1);
					}
				}
			]],
	//		tools : [{iconCls: 'icon-save'}],
			columns:[
				[
					{field:'name',title:'姓名',width:120,rowspan:2, align:'center', sortable:true,
						sorter:function(a,b){
							return (a>b?1:-1);
						}
					},
					{field:'friend_number',title:'带朋友人数',width:100, align:'center', rowspan:2,sortable:true,
						sorter:function(a,b){
							return (a-b>0?1:-1);
						},
						editor : {
							type:'numberbox', options:
							{
								min : 0,
								max : 10,
								precision : 0
							}
						}
					},
					{title:'结算信息',colspan:2, align:'center'},
					{field:'pay_number',title:'应付金额',width:80,sortable:true, align:'center', rowspan:2, sorter:function(a,b){
							return (a-b>0?1:-1);
						},
						formatter : function(value) {
							if(value != null && (value+'') != '') {
								return Util.formatMoney(value); 
							}
							return '';
						}
					}
				],
				[
					{field:'pay_pattern',title:'结算方式', align:'center', width:120,
					 	editor : {
							type:'combobox', options:
							{
								valueField:'patternId',
								textField:'patternName',
								width : 120,
								editable : false,
								data:Constants.activityPayPattern,
								required:true,
								panelHeight : "auto"
								/* 以下是结算方式的选择事件
								onSelect : function(record) {
									var editor = $('#peopleList').datagrid('getEditor', 
										{index : lastIndex, field : 'pay_pattern_info'});

									switch(record.patternId) {
										// 折扣方式
										case Constants.activityPayPattern[0].patternId :
											editor.target.numberbox({min : 0, max : 1, precision : 1});
											editor.target.val(1);
											break;
										// 现金方式
										case Constants.activityPayPattern[1].patternId :
											editor.target.numberbox({min : 0, max : 10000, precision : 2});
											editor.target.val(0.00);
											break;
									}
								}*/
							}
						},
						formatter : function(value) {
							for(var i=0; i<Constants.activityPayPattern.length; i++){
								if (Constants.activityPayPattern[i].patternId == value) {
									return Constants.activityPayPattern[i].patternName;
								}
							}
							return value;
						}
					},
					{field:'pay_pattern_info',title:'对应数值', align:'center', width:120,
						editor : {
							type:'numberbox', options:
							{
								min : 0,
								max : 10000,
								precision : 1
							}
						}
					}
				]
			],
			onDblClickRow:function(rowIndex){
				$('#peopleList').datagrid('beginEdit', rowIndex);
				lastIndex = rowIndex;
			},
			onClickRow : function(rowIndex) {
				$('#peopleList').datagrid('unselectRow', rowIndex);
				$('#peopleList').datagrid('endEdit', lastIndex);
			},
			onSelect : function(rowIndex) {
				$('#peopleList').datagrid('endEdit', lastIndex);
			},
			onAfterEdit : checkRowInputData
		});
		
		// [附加信息1]光标移走操作
		$('#activity_info1').blur(function() {
			if(this.value == '') {
				// 如果没有输入值，则设置为默认值
				this.value = Constants.activity.defaultPlaceNumber;
			}
		});
		
		// 绑定页面事件
		$('#btnSave').click(toolbar_saveActivity_click);
		$('#btnUndo').click(toolbar_goBack_click);
		$('#btnAdd').click(toolbar_appendPeople_click);
		$('#btnRemove').click(toolbar_removePeople_click);
		$('#btnWelcome').click(toolbar_welcome_click);
		$('#btnMakesure').click(toolbar_makesure_click);
		$('#btnPay').click(toolbar_pay_click);
		$('#btnCancel').click(toolbar_cancel_click);		
		
		queryPeopleWindow = new QueryPeopleWindow({afterSelectProcess : afterSelectProcess});	
		sendMailForm = new SendMailForm();
		
		// 页面初始化
		page_load();
	});


	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////
	// 页面加载完成后初始化函数
	function page_load() {	
		LoggerWrapper.debug("[page_load] window.parent.ActivitySystem.publicParam.updateActivityId :"
		 + window.parent.ActivitySystem.publicParam.updateActivityId);
		if(window.parent.ActivitySystem.publicParam.updateActivityId == null) {
			// 新规的场合
			// 设置标题
			$('#activityInfo').window('setTitle', '创建活动');
			// 不显示状态图标
			$("[name='activity_status_view']").hide();
			// 初始化时活动名称的设定
			setNameDynamic();
			// 默认球场数量值的设置
			$('#activity_info1').val(Constants.activity.defaultPlaceNumber);
			// 初始化时候加载数据
			$('#peopleList').datagrid("loadData", getInitPeopleData());
			// 初始化时enable状态的设定
			// 未做成状态
			$('#btnWelcome').attr('disabled', true);
			$('#btnMakesure').attr('disabled', true);
			$('#btnPay').attr('disabled', true);
			$('#btnCancel').attr('disabled', true);
			$('#activity_cost').attr('disabled', true);
		} else {
			// 更新或者复制的场合
			// 页面的初始化设定
			initPage();
		}
	}

	// 活动种类选择处理
	function activityKind_select(record) {
		setNameDynamic();
		
		switch(record.id) {
			case Constants.activityKind[0].id :
				// 羽毛球的场合
				$('#activity_info1').val(Constants.activity.defaultPlaceNumber);
				// 显示附加信息
				$('tr.activityAppendInfo').css("display", "inline");
				break;
			case Constants.activityKind[1].id :
				// 聚餐的场合
				$('#activity_info1').val('');
				// 隐藏附加信息
				$('tr.activityAppendInfo').css("display", "none");
				break;
		}
	}

	// 活动时间的change事件
	function activityDate_change() {
		setNameDynamic();
	}

	// [保存]按钮按下处理
	function toolbar_saveActivity_click() {
		var act = getActivityObjFromView();
		// 查询对象的构建
		var queryObj = new Activity();
		// 按活动名称查询
		queryObj.activity_name = act.activity_name;

		var results = queryObj.queryByPageInfo();
		// 定义保存处理的函数	
		var saveFunction = function(activity) {
			var strInfo;
			if(activity.activity_id == null || activity.activity_id == '') {
				// 新规的场合
				activity.insert();
				LoggerWrapper.debug("[toolbar_saveActivity_click] afterInsert The Activity_status:" + activity.activity_status);
				setPageControlStatus(activity)
				strInfo = Message.I_A_00_000_0001;
			} else {
				// 更新的场合
				activity.update();
				strInfo = Message.I_A_00_000_0002;
			}
			// 提示成功信息
			ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005, msg : strInfo});
			LoggerWrapper.debug("[toolbar_saveActivity_click] After save, The Activity_id is :" + activity.activity_id);
			// 当前画面的再刷新
			setViewFromObj(activity);
			
		};
		
		if(results != null && results.length > 0) {
			var newActivityName;
			// 当前活动名称存在的场合
			var f = function(r) {
				if (r){
					act.activity_name = newActivityName;
					saveFunction(act);
				}
			};
			
			if(act.activity_id != null && act.activity_id != '' && results[0].activity_id == act.activity_id) {
				// 更新的场合，并且查询结果只是当前要更新的这一条的场合
				saveFunction(act);
			} else {
				var strInfo = Message.I_A_00_000_0003.replace("{0}", act.activity_name);
				// 取得唯一的新名字
				newActivityName = Activity.getUniqueActivityName(act.activity_name);

				strInfo = strInfo.replace("{1}", newActivityName);
				// 弹出确认框
				$.messager.confirm(Message.T_C_00_000_0002, strInfo, f);
			}
			
		} else {
			saveFunction(act);
		}
	}

	// [返回]按钮按下处理
	function toolbar_goBack_click() {
		window.location.href = "activityList.html";
	}


	// [添加人员]单击事件
	function toolbar_appendPeople_click() {
		var peoples = $('#peopleList').datagrid('getData').rows;
		var ids = [];
		if(peoples != null) {
			for(var i=0; i<peoples.length; i++) {
				ids.push(peoples[i].id);
			}
		}
		
		LoggerWrapper.debug("[toolbar_appendPeople_click] peoples.length : " + peoples.length);
		LoggerWrapper.debug("[toolbar_appendPeople_click] peoples.tostring : " + Util.objToString(peoples));
		
		queryPeopleWindow.openWindow(ids);
	}

	// [移除人员]单击事件
	function toolbar_removePeople_click() {
		// 选择的记录集和
		var selections = Util.getDataGridSelections('#peopleList');
		if(selections == null || selections.length == 0) {
			// 没有选择的场合
			$.messager.alert(Message.T_C_00_000_0001, Message.E_A_00_000_0001, 'error');
			return;
		}
		var count = selections.length;
		var rowIndex;
		for(var i=0; i<count; i++) {
			LoggerWrapper.debug("[toolbar_removePeople_click] selections.length : " + selections.length);
			rowIndex = $('#peopleList').datagrid('getRowIndex', selections[0]);
			LoggerWrapper.debug("[toolbar_removePeople_click] rowIndex : " + rowIndex);
			$('#peopleList').datagrid("deleteRow", rowIndex);
		}
	}


	// [邀请]单击事件
	function toolbar_welcome_click() {
		var currentStatus = $('#activity_status').val();
		// 真正的邀请处理函数
		var f = function() {
			var handler = new WelcomeMailHandler(getActivityObjFromView());
			SendMailForm.mailHandler = handler;	
			sendMailForm.openWindow(handler.getMessage());
			handler.sendMailSuccessProcess = activitySendMailSuccessProcess;
			handler.params = {statusId:'2'};
		};
		
		WarnWhenChangeStatus(currentStatus, 2, f);
	}

	// [确认]单击事件
	function toolbar_makesure_click() {
		var currentStatus = $('#activity_status').val();
		// 真正的邀请处理函数
		var f = function() {
			var handler = new MakesureMailHandler(getActivityObjFromView());
			SendMailForm.mailHandler = handler;	
			// 设置邮件发送成功后处理函数
			handler.sendMailSuccessProcess = activitySendMailSuccessProcess;
			// 设置以上处理函数的参数
			handler.params = {statusId:'3'};
			
			sendMailForm.openWindow(handler.getMessage());
		};
		
		WarnWhenChangeStatus(currentStatus, 3, f);
	}

	// [取消]单击事件
	function toolbar_cancel_click() {
		// 真正的邀请处理函数
		var f = function() {
			var handler = new CancelMailHandler(getActivityObjFromView());
			SendMailForm.mailHandler = handler;	
			// 设置邮件发送成功后处理函数
			handler.sendMailSuccessProcess = activitySendMailSuccessProcess;
			// 设置以上处理函数的参数
			handler.params = {statusId:'5'};
			// 打开发送邮件窗口
			sendMailForm.openWindow(handler.getMessage());
		};
		
		WarnWhenChangeStatus(null, 5, f);	
	}

	// [结算]单击事件
	function toolbar_pay_click() {
		var currentStatus = $('#activity_status').val();
		
		// 真正的邀请处理函数
		var f = function() {
			var act = getActivityObjFromView();
			LoggerWrapper.debug("[toolbar_pay_click] currentStatus:" + currentStatus);
			if(currentStatus != 4) {
				// 第一次结算
				// 判断是否输入活动费用
				if($('#activity_cost').val() == '') {
					// 活动费用没有输入的场合
					throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0009');
					return;
				}
				// 进行计算
				ActivityCalculator.calculate(act);

				// 设置状态为4：已结算
				act.activity_status = 4;
				// 计算结果保存
				act.updatePayInfo();

				// 提示保存成功信息
				ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005, msg : Message.I_A_00_000_0010});
				
				// 对画面进行更新
				// 设置隐藏域活动状态的值
				$('#activity_status').val('4');
				// 显示状态图标
				$("[name='activity_status_view']").hide();
				$("[name='activity_status_view'][iconCls='" + Constants.activity.status['4'].icon + "']").show();
				
				// 重新加载人员列表数据
				$('#peopleList').datagrid("loadData", {"total":act.activity_members.length, "rows":act.activity_members});
			
				// 画面控制的设定
				setPageControlStatus(getActivityObjFromView());
			}
			LoggerWrapper.debug("[toolbar_pay_click] act.activity_members" + Util.objToString(act.activity_members[0]));
			// 已经结算过,或者第一次结算信息保存后，弹出发送邮件窗体
			var handler = new PayMailHandler(act);
			SendMailForm.mailHandler = handler;	
			// 打开发送邮件窗口
			sendMailForm.openWindow(handler.getMessage());	
		};
		
		WarnWhenChangeStatus(currentStatus, 4, f);
	}



	//////////////////////////////////////////////////////////
	///               页面私有函数部分                       ///
	//////////////////////////////////////////////////////////

	// 动态设置活动名称
	function setNameDynamic() {
		// 格式化活动时间，只要日期
		var strActivityDate = $('#activity_date').datetimebox('getValue');
		strActivityDate = Date.CreateDateTime(strActivityDate).format('yyyy-MM-dd');
		var strActivityKind = $('#activity_kind').combobox('getText');
		// 动态改变名称
		var strActivityName = Constants.activity.namePattern.replace('%d', strActivityDate).replace('%n', strActivityKind);
		$('#activity_name').val(strActivityName);
	}

	// 得到创建活动时的初始人员信息
	function getInitPeopleData(){
		var p = new People();
		p.join = Constants.yesAndNo.yes;
		
		// 取得默认参加一切活动的人员信息
		var results = p.queryByPageInfo();
		
		for(var i=0; i<results.length; i++) {
			results[i].friend_number = Constants.activity.defaultFriendNumber;
			results[i].pay_pattern = Constants.activity.defaultPayPattern;
			results[i].pay_pattern_info = Constants.activity.defaultPayPatternInfo;
			results[i].pay_number = '';
		}
		
		var dataList = {                                                      
			"total" : results.length,
			"rows" : results
		};
		return dataList;
	}

	// 检查针对人员信息输入的信息，比如带朋友数量，结算方式信息
	// 对于检查不通过的项目，进行默认值设置并弹出警告框
	function checkRowInputData(rowIndex, rowData, changes) {
		LoggerWrapper.debug("[checkRowInputData] rowIndex:" + rowIndex);
		LoggerWrapper.debug("[checkRowInputData] rowData:" + Util.objToString(rowData));
		// 带朋友数量的空检查
		if(rowData.friend_number == '') {
			rowData.friend_number = 0;
		}
		
		LoggerWrapper.debug("[checkRowInputData] " + rowData.pay_pattern == Constants.activityPayPattern[0].patternId);
		
		// 联动检查
		switch(rowData.pay_pattern) {

			// 折扣方式
			case '' + Constants.activityPayPattern[0].patternId :
			case Constants.activityPayPattern[0].patternId:
				// 对应数值的空检查
				if(rowData.pay_pattern_info == '' || rowData.pay_pattern_info > 1) {
					LoggerWrapper.debug("[checkRowInputData] rowData.pay_pattern_info == '' || rowData.pay_pattern_info > 1");
					rowData.pay_pattern_info = 1.0;
				}
				break;
			// 现金方式
			case '' + Constants.activityPayPattern[1].patternId :
			case Constants.activityPayPattern[1].patternId :
				// 对应数值的空检查
				if(rowData.pay_pattern_info == '') {
					rowData.pay_pattern_info = 0.0;
				}
				break;
		}
		// 刷新当前行
		$('#peopleList').datagrid('refreshRow', rowIndex);
	}

	// 从人员选择画面选择后确定按钮按下后的处理
	function afterSelectProcess(selections) {
		for(var i=0; i<selections.length; i++) {
			selections[i].friend_number = Constants.activity.defaultFriendNumber;
			selections[i].pay_pattern = Constants.activity.defaultPayPattern;
			selections[i].pay_pattern_info = Constants.activity.defaultPayPatternInfo;
			selections[i].pay_number = '';
		}
		
		var rows = $('#peopleList').datagrid('getRows');
		rows = rows.concat(selections);

		var peoples = {
			"total" : rows.length,
			"rows" : rows
		};
		
		$('#peopleList').datagrid('loadData', peoples);
	}

	// 从画面View得到activity对象
	function getActivityObjFromView() {
		var act = new Activity();
		// LoggerWrapper.debug("[getActivityObjFromView] 画面隐藏域activity_id : " + $('#activity_id').val());
		act.activity_id = $('#activity_id').val();
		act.activity_name = $('#activity_name').val();
		act.activity_kind = $('#activity_kind').combobox('getValue');
		act.activity_date = $('#activity_date').datetimebox('getValue');
		act.activity_cost = $('#activity_cost').val();
		act.activity_status = $('#activity_status').val();
		act.activity_memo = $('#activity_memo').val();
		act.activity_info1 = $('#activity_info1').val();
		act.activity_info2 = $('#activity_info2').val();
		act.activity_info3 = $('#activity_info3').val();
		act.activity_info4 = $('#activity_info4').val();
		act.activity_info5 = $('#activity_info5').val();
		act.activity_members = $('#peopleList').datagrid('getRows');
		return act;
	}

	// 根据activity对象设置画面View
	// 这个是在新规做成之后，转为更新模式时调用
	function setViewFromObj(act) {
		// 设置标题
		$('#activityInfo').window('setTitle', '更新活动');
		// 画面隐藏域的设置
		LoggerWrapper.debug("[setViewFromObj] act.activity_id : " + act.activity_id);
		$('#activity_id').val(act.activity_id);
		$('#activity_name').val(act.activity_name);
		// 显示状态图标
		$("[name='activity_status_view']").hide();
		LoggerWrapper.debug("[setViewFromObj] status.icon : " + Constants.activity.status[''+act.activity_status].icon);
		LoggerWrapper.debug("[setViewFromObj] status.msg : " + Constants.activity.status[''+act.activity_status].msg);
		$("[name='activity_status_view'][iconCls='" + Constants.activity.status[''+act.activity_status].icon + "']").show();
	}


	// 根据activity对象设置画面View
	// 这个是更新模式或者复制活动时，根据ID取得活动信息后设置画面
	function setViewFromQueryObj(act) {
		// 画面隐藏域的设置
		$('#activity_id').val(act.activity_id);

		$('#activity_kind').combobox('setValue', act.activity_kind);
		if(act.activity_kind == Constants.activityKind[1].id) {
			// 隐藏附加信息
			$('tr.activityAppendInfo').css("display", "none");
		}
		$('#activity_date').datetimebox('setValue', act.activity_date);
		// 特别注意，名称的设定要放到种类和日期的后面
		$('#activity_name').val(act.activity_name);
		$('#activity_cost').val(act.activity_cost);
		$('#activity_status').val(act.activity_status);
		$('#activity_memo').val(act.activity_memo);
		$('#activity_info1').val(act.activity_info1);
		$('#activity_info2').val(act.activity_info2);
		$('#activity_info3').val(act.activity_info3);
		$('#activity_info4').val(act.activity_info4);
		$('#activity_info5').val(act.activity_info5);
		// 显示状态图标
		$("[name='activity_status_view']").hide();
		$("[name='activity_status_view'][iconCls='" + Constants.activity.status[''+act.activity_status].icon + "']").show();
	}



	// 页面的初始化设定
	function initPage() {
		// 初始化画面内容
		var queryAct = new Activity();
		queryAct.activity_id = window.parent.ActivitySystem.publicParam.updateActivityId;
		// 根据ID取得活动信息
		var results = queryAct.queryByPageInfo();
		var activity;
		var members = [];
		if(results != null && results.length > 0) {
			activity = results[0];
			// 根据查询结果设置画面值
			setViewFromQueryObj(activity);
			// 取得参加活动人员信息列表
			members = Activity.getMembers(activity.activity_id);
			
			if(!window.parent.ActivitySystem.publicParam.isCopyActivity) {
				// 更新的场合
				// 设置标题
				$('#activityInfo').window('setTitle', '更新活动');
				// 初始化画面空间的状态，可用性等等
				setPageControlStatus(activity);	
			} else {
				// 复制的场合
				// 设置标题
				$('#activityInfo').window('setTitle', '创建活动');
				
				// 不显示状态图标
				$("[name='activity_status_view']").hide();
				// 初始化时enable状态的设定
				// 未做成状态
				$('#btnWelcome').attr('disabled', true);
				$('#btnMakesure').attr('disabled', true);
				$('#btnPay').attr('disabled', true);
				$('#btnCancel').attr('disabled', true);
				$('#activity_cost').attr('disabled', true);
				// 要把状态改为1,未邀请
				$('#activity_status').val('1');
				// 把活动ID号给删除掉
				$('#activity_id').val('');
				// 活动费用设空
				$('#activity_cost').val('');
				// 
				for(var i=0; i<members.length; i++) {
					members[i].pay_number = null;
				}
			}
			
			// 初始化人员列表
			$('#peopleList').datagrid("loadData", members);
		}
	}

	// 初始化画面空间的状态，可用性等等
	function setPageControlStatus(activity) {
		switch(activity.activity_status) {
			case 1:
			case ''+1:
				// 未邀请
				// 保存按钮
				$('#btnSave').attr('disabled', false);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', false);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', false);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', false);
				// 确认按钮
				$('#btnMakesure').attr('disabled', false);
				// 结算按钮
				$('#btnPay').attr('disabled', true);
				// 取消按钮
				$('#btnCancel').attr('disabled', false);
				// 费用inputtext
				$('#activity_cost').attr('disabled', true);
				// 活动时间控件
				$('#activity_date').datetimebox('enable');
				// 活动种类控件
				$('#activity_kind').combobox('enable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', false);
				break;
			case 2:
			case 2+'':
				// 已邀请
				// 保存按钮
				$('#btnSave').attr('disabled', false);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', false);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', false);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', false);
				// 确认按钮
				$('#btnMakesure').attr('disabled', false);
				// 结算按钮
				$('#btnPay').attr('disabled', true);
				// 取消按钮
				$('#btnCancel').attr('disabled', false);
				// 费用inputtext
				$('#activity_cost').attr('disabled', true);
				// 活动时间控件
				$('#activity_date').datetimebox('disable');
				// 活动种类控件
				$('#activity_kind').combobox('disable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', false);
				break;
			case 3:
			case 3+'':
				// 已确认
				// 保存按钮
				$('#btnSave').attr('disabled', false);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', false);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', false);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', true);
				// 确认按钮
				$('#btnMakesure').attr('disabled', false);
				// 结算按钮
				$('#btnPay').attr('disabled', false);
				// 取消按钮
				$('#btnCancel').attr('disabled', false);
				// 费用inputtext
				$('#activity_cost').attr('disabled', false);
				// 活动时间控件
				$('#activity_date').datetimebox('disable');
				// 活动种类控件
				$('#activity_kind').combobox('disable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', false);
				break;
			case 4:
			case 4+'':
				// 已结算
				// 保存按钮
				$('#btnSave').attr('disabled', true);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', true);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', true);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', true);
				// 确认按钮
				$('#btnMakesure').attr('disabled', true);
				// 结算按钮
				$('#btnPay').attr('disabled', false);
				// 取消按钮
				$('#btnCancel').attr('disabled', true);
				// 费用inputtext
				$('#activity_cost').attr('disabled', true);
				// 活动时间控件
				$('#activity_date').datetimebox('disable');
				// 活动种类控件
				$('#activity_kind').combobox('disable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', true);
				break;
			case 5:
			case 5+'':
				// 已取消
				// 保存按钮
				$('#btnSave').attr('disabled', true);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', true);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', true);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', true);
				// 确认按钮
				$('#btnMakesure').attr('disabled', true);
				// 结算按钮
				$('#btnPay').attr('disabled', true);
				// 取消按钮
				$('#btnCancel').attr('disabled', true);
				// 费用inputtext
				$('#activity_cost').attr('disabled', true);
				// 活动时间控件
				$('#activity_date').datetimebox('disable');
				// 活动种类控件
				$('#activity_kind').combobox('disable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', true);
				break;
			default:
				// 保存按钮
				$('#btnSave').attr('disabled', true);
				// 添加人员按钮
				$('#btnAdd').attr('disabled', true);
				// 移除人员按钮
				$('#btnRemove').attr('disabled', true);
				// 邀请按钮
				$('#btnWelcome').attr('disabled', true);
				// 确认按钮
				$('#btnMakesure').attr('disabled', true);
				// 结算按钮
				$('#btnPay').attr('disabled', true);
				// 取消按钮
				$('#btnCancel').attr('disabled', true);
				// 费用inputtext
				$('#activity_cost').attr('disabled', true);
				// 活动时间控件
				$('#activity_date').datetimebox('disable');
				// 活动种类控件
				$('#activity_kind').combobox('disable');
				// 活动附加信息1
				$('#activity_info1').attr('disabled', true);
				break;
		}

	}

	// 发送邮件成功后的处理
	function activitySendMailSuccessProcess(params) {
		// 保存活动信息
		// 设置状态（已邀请）
		$('#activity_status').val(params.statusId)
		// 保存活动信息特别是状态信息
		toolbar_saveActivity_click();
		// 画面控制
		setPageControlStatus(getActivityObjFromView());
		
		ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0006, msg : Message.I_A_00_000_0004});
	}


	// 改变状态时的提示信息
	// currentStatus : 当前状态
	// newStatus : 即将更新后的状态
	function WarnWhenChangeStatus(currentStatus, newStatus, processFunction) {
		// 确认信息
		var strConfirmInfo = '';
		var needWarn = false;
		// 回调函数，将result设置为选择的选项
		var f = function(r) {
			if(r && processFunction) {
				processFunction();
			}
		};
		
		if(newStatus == 5) {
			// 进行取消活动
			needWarn = true;
			strConfirmInfo = Message.I_A_00_000_0007;
		} else if(newStatus == 4) {
			// 进行结算
			needWarn = true;
			if(currentStatus != 4) {
				// 第一次进行结算
				strConfirmInfo = Message.I_A_00_000_0008;
			} else {
				// 已经结算过，此时只能发信
				strConfirmInfo = Message.I_A_00_000_0009;
			}
			
		} else if(currentStatus == newStatus) {
			// 重复进行一个状态的操作，比如重复邀请，或者重复确认
			needWarn = true;
			strConfirmInfo = Message.I_A_00_000_0005.replace(/\{0\}/g, Constants.activity.status[currentStatus].confirmText);
		} else if(newStatus - currentStatus > 1) {
			// 跳过一个状态直接进入下一个状态。比如处于未邀请的状态直接进行确认
			needWarn = true;
			var status = Number(currentStatus) + 1;
			strConfirmInfo = Message.I_A_00_000_0006.replace("{0}", Constants.activity.status[status].confirmText);
			strConfirmInfo = strConfirmInfo.replace("{1}", Constants.activity.status[newStatus].confirmText);
		}
		
		if(needWarn) {
			// 需要弹出确认框，弹出确认框
			$.messager.confirm(Message.T_C_00_000_0002, strConfirmInfo, f);
		} else {
			// 不需要弹出确认框，直接处理
			processFunction();
		}
		
	}

});