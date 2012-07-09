// The Util to process DB
var Util = {
	initForm : initForm,
	validateForm : validateForm,
	getDataGridSelected : getDataGridSelected,
	getDataGridSelections : getDataGridSelections,
	objToString : objToString,
	arrToString : arrToString,
	getActivityKindTextById : getActivityKindTextById,
	formatMoney : formatMoney
};

// 初始化表单通用方法
function initForm(form) {
	if(form) {
		form.reset();
		for(var i=0; i<form.elements.length; i++) {
			$('#' + form.elements[i].id).removeClass('validatebox-invalid');
		}
	}
}


// 通用验证表单方法
function validateForm(form) {
	if(form) {
		for(var i=0; i<form.elements.length; i++) {
			var id = form.elements[i].id;
			if(id && id.substr(0, 5) == 'vali_') {
				//form.elements[i].validate();
				$('#' + id).validatebox('validate');
				if($('#' + id).validatebox('isValid') == false) {
					return false;
				}
			}
		}
	}
	return true;
}

// 返回选择的行信息，如果没有选择，返回null
function getDataGridSelected(id){
	var selected = $(id).datagrid('getSelected');
	return selected ? selected : null;
}

// 返回选择的行信息集合，如果没有选择，返回null
function getDataGridSelections(id){
	var rows = $(id).datagrid('getSelections');
	return rows? rows : null;
}

// 打印Object
function objToString(obj){
	var str = '{';
	for(var i in obj) {
		str += i;
		str += ":";
		str += obj[i];
		str += " , ";
	}
	str += "}";
	return str;
}

// Print The Array
function arrToString(arr){
	var str = '{';
	if(arr) {
		for(var i=0; i<arr.length; i++) {
			str += arr[i] + "\n";
		}
	}
	str += "}";
	return str;
}

// 通过活动类型ID取得活动名称
function getActivityKindTextById(id) {
	for(var i=0; i<Constants.activityKind.length; i++) {
		if(Constants.activityKind[i].id == id) {
			return Constants.activityKind[i].text;
		}
	}
	return '';
}

// 格式化金额（四舍五入保留2位小数）
function formatMoney(num) {
	return Math.round(num*100)/100;
}



