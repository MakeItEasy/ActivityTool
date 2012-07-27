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
		
		$('#peopleList').datagrid({
			title: '人员一览',
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
				id:'btnDelete',
				text:'删除',
				iconCls:'icon-remove',
				handler:btnDelete_click
			},'-',{
				id:'btnRechange',
				text:'充值',
				iconCls:'icon-money',
				handler:btnRechange_click
			}]
		});

		// 初始化时候加载数据
		$('#peopleList').datagrid("loadData", getPageData(Constants.initPageInfo));

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
		// 新建人员的窗体定义
		$('#createPeople').window({
			title: '新建人员',
			iconCls: 'icon-save',
			modal: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			draggable: false,
			resizable : false,
			closed: true
		});
		
		// 绑定画面的事件
		$('#btnSavePeople').click(savePeople);
		$('#btnSearch').click(btnSearch_click);
		$('#btnCancleSavePeople').click(function(){
			$('#createPeople').window('close');
		});
		
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
		// 初始化Form处理
		Util.initForm(document.forms['createForm']);
		$('#vali_id').attr('disabled', false);
		$('#balance').val('0'),
		// 数据操作模式的设定
		$('#createPeople').window.createMode = 1;
		$('#createPeople').window('setTitle', '新建人员');
		$('#createPeople').window('open');
	}

	// 更新button按下处理
	function btnEdit_click(){
		// 数据操作模式的设定
		$('#createPeople').window.createMode = 2;
		var f = initEditWindow;
		var noSelectionStr = Message.W_C_00_000_0001.replace('{0}', '更新');
		var mulSelectionStr = Message.W_C_00_000_0002.replace('{1}', '更新');
		processSelections(f, 1, noSelectionStr, mulSelectionStr);
	}

	// 删除button按下处理
	function btnDelete_click(){
		
		var f = deleteProcess;
		var noSelectionStr = Message.W_C_00_000_0001.replace('{0}', '删除');
		processSelections(f, 2, noSelectionStr);
	}

	// 充值button按下处理
	function btnRechange_click(){
		var f = rechange;
		var noSelectionStr = Message.W_C_00_000_0001.replace('{0}', '充值');
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
			p = new People(strQuery, strQuery, null, strQuery);
			p.queryOption.andOr = Constants.sql.or;
			p.queryOption.equalOrLike = Constants.sql.like;
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

	// 初始化更新情报部
	function initEditWindow(p) {
		// 初始化Form处理
		Util.initForm(document.forms['createForm']);
		var people = new People(p.id).queryByKey();
		// 人员存在性检查
		if(people == null) {
			LoggerWrapper.debug("[initEditWindow] " + p.id + " is not exist!");
			throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0004');
		}
		$('#vali_id').attr('disabled', true);
		$('#vali_id').val(people.id);
		$('#vali_name').val(people.name);
		$("input[id='sex'][value='" + people.sex + "']").attr("checked",true); 
		$('#vali_email').val(people.email);
		$('#balance').val(Util.formatMoney(people.balance));
		$("input[id='join'][value='" + people.join + "']").attr("checked",true); 
		$("input[id='recivemail'][value='" + people.recivemail + "']").attr("checked",true); 
		$('#createPeople').window('setTitle', '编辑人员');
		$('#createPeople').window('open');
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

	// 删除处理
	function deleteProcess(selections) {
		if(selections && selections.length > 0) {
			// 取得所有选择ID的集合
			var ids = [];
			for(var i=0; i<selections.length; i++){
				ids.push(selections[i].id);
			}
			var str = Message.I_C_00_000_0001;
			str += '<br />';
			str += ids.join(' : ');

			var f = function(r) {
				if(r) {
					var strDelete = 'UPDATE t_people SET delete_flag = 1 WHERE people_id IN (' + ids.join(',') + ')';
					try
					{
						// 执行删除语句
						DBUtil.executeSql(strDelete);
						// 删除成功处理
						ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005,
							msg : Message.I_C_00_000_0002.replace('{0}', ids.join(' : ')).replace('{1}', '删除')
						});
						// 画面刷新处理
						refreshData();
					}
					catch (ex)
					{
						LoggerWrapper.error(ex);
						throw new Error(Constants.errorNumber.defaultNumber, 'E_P_00_000_0003');
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

	// 保存人员信息
	// mode 1:新建 2:更新		
	function savePeople(mode){
		// 表单验证
		var checkResult = Util.validateForm(document.forms['createForm']);
		if(checkResult) {
			// 验证通过
			var p = new People($('#vali_id').val(), 
							$('#vali_name').val(),
							$("input[id='sex']:checked").val(),
							$('#vali_email').val(),
							$('#balance').val(),
							$("input[id='join']:checked").val(),
							$("input[id='recivemail']:checked").val(),
							0);
			var strTemp = '';
			if($('#createPeople').window.createMode == 1) {
				// 新建的场合
				strTemp = '添加';
				p.insert();
				
			} else {
				// 更新的场合
				strTemp = '更新';
				p.update();
			}	

			// 处理成功后
			ActivityToolSystem.Handler.HandleSuccessShow({title : Message.T_C_00_000_0005,
				msg : Message.I_C_00_000_0002.replace('{0}', p.id).replace('{1}', strTemp)
			});

			$('#createPeople').window('close');
			
			// 画面刷新处理
			refreshData();
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
			$('#peopleList').datagrid('clearSelections');
			// 加载指定页面数据				
			$('#peopleList').datagrid("loadData", getPageData(pageInfo, getQueryObject()));
			// 清除所有的选择
			$('#peopleList').datagrid('reload');
		}
	}

});