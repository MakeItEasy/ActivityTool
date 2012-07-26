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
	var Rechange = require('./Rechange.js');
	
	ActivityToolSystem.init();

	//////////////////////////////////////////////////////////
	///               初始化加载部分                         ///
	//////////////////////////////////////////////////////////

	$(function(){
		// 画面的错误处理
		onerror = ActivityToolSystem.Handler.HandleError;
	
		// 新建人员的窗体定义
		/*$('#createPeople').window({
			title: '新建人员',
			iconCls: 'icon-save',
			modal: false,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			draggable: false,
			resizable : false,
			closed: false
		});
		*/
		// 绑定画面的事件
		$('#btnQuicklyPay').click(btnQuicklyPay_click);
		
	});


	//////////////////////////////////////////////////////////
	///               页面事件处理部分                       ///
	//////////////////////////////////////////////////////////

	// 查询button按下处理
	function btnQuicklyPay_click(){
		var strQuery = $('#txtCondition').val().trim();
		$('#txtCondition').val(strQuery);
		// 页面刷新
		refreshData(Constants.initPageInfo);
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
			p = new People(strQuery, strQuery, null, strQuery);
			p.queryOption.andOr = Constants.sql.or;
			p.queryOption.equalOrLike = Constants.sql.like;
		}
		return p;
	}

	// 充值处理
	function rechange(selections) {
		if(selections && selections.length > 0) {
			// 取得所有选择ID的姓名集合
			var names = [];
			for(var i=0; i<selections.length; i++){
				names.push(selections[i].name);
			}
			
			var strInfo = "充值对象人员：<br />";
			strInfo += names.join(' : ');
			strInfo += '<br/><br/>';
			strInfo += Message.I_R_00_000_0001;
			
			// 弹出确认框
			$.messager.prompt(Message.T_C_00_000_0003, strInfo, function(r){
				if(r) {
					if(!isNaN(r)) {
						Rechange.mulRechange(selections, r);
						// 充值成功处理
						ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005,
							msg : Message.I_R_00_000_0002 + '<br/><br/>' + names.join(' : ')
						});
						// 画面刷新处理
						refreshData();
					} else {
						alert('输入金额不是数值!');
					}
				}
			});		
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
	
});