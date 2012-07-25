define(function(require, exports, module) {


	var LoggerWrapper = require('./LoggerWrapper.js');
	var $ = require('../jquery-easyui/jquery.js');
	require('../jquery-easyui/jquery-easyui.js')($);

	//////////////////////////////////////////////////////////
	///               系统公用页面间传递参数部分               ///
	//////////////////////////////////////////////////////////
	exports.publicParam = {
		// 向创建活动页面传递的参数,如果为空,代表是新规,如果不为空,代表更新
		updateActivityId : null
	};
	
	// 系统共用处理函数
	exports.Handler = {
		HandleError : DefaultHandleError,
		HandleSuccessShow : DefaultHandleSuccessShow
	};
	
	exports.init = init;
	
	
	
	function init() {
		if(!window.parent.ActivitySystem) {
			window.parent.ActivitySystem = {
				publicParam : {
					updateActivityId : null,
					isCopyActivity : false
				}
			};
		}
		
		//////////////////////////////////////////////////////////
		///               重写或追加系统对象部分                  ///
		//////////////////////////////////////////////////////////
		// String对象的trim函数追加
		String.prototype.trim= function(){  
		    // 用正则表达式将前后空格  
		    // 用空字符串替代。  
		    return this.replace(/(^\s*)|(\s*$)/g, "");  
		}

		// Error对象toString方法重写
		Error.prototype.toString = function(){
			var str = "Exception { number:" + this.number;
			str += ", description:" + this.description + " }";
			return str;
		}


		// 将给定的字符串转化为Date对象
		Date.CreateDateTime = function(s)
		{
		    var strInfo = s.match(/\d+/g);
		    var d = new Date(), r = [d.getFullYear(), d.getMonth() + 1, d.getDate(), 0, 0, 0];

		    for (var i = 0; i < 6 && i < strInfo.length; i++)
		        r[i] = strInfo[i].length > 0 ? strInfo[i] : r[i];
		    return new Date(r[0],r[1]-1,r[2],r[3],r[4],r[5]);
		};

		/**
		  * 时间对象的格式化;
			使用方法:
		  		var testDate = new Date();
				var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
				alert(testStr);
		  */
		Date.prototype.format = function(fmt){
			/*
			* eg:format="YYYY-MM-dd hh:mm:ss";
			*/
			var format = "yyyy-MM-dd hh:mm:ss";
			if(fmt) {format = fmt;}
			
			var o = {
				"M+" :  this.getMonth()+1,  //month
				"d+" :  this.getDate(),     //day
				"h+" :  this.getHours(),    //hour
				"m+" :  this.getMinutes(),  //minute
				"s+" :  this.getSeconds(), //second
				"q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
				"S"  :  this.getMilliseconds() //millisecond
				};
			
			if(/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			
			for(var k in o) {
				if(new RegExp("("+ k +")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
				}
			}
			return format;
		}
	}


	//////////////////////////////////////////////////////////
	///               私有方法定义部分                       ///
	//////////////////////////////////////////////////////////

	/** 默认的全局错误处理方法
	  * msg : 错误信息，也就是Exception的description属性值
	  * url : 错误发生的文件URL
	  * line : 错误发生的行号
	  * return : true:就不在页面显示javascript错误 false:在页面显示错误
	  */
	function DefaultHandleError(msg, url, line)
	{
		if(msg.split('_').length == 5) {
			// 我的自定义异常的场合
			$.messager.alert(Message['T_C_00_000_0001'], Message[msg], 'error');
		} else {
			// 画面上其他js错误的场合
			$.messager.alert(Message['T_C_00_000_0001'], Message['E_C_00_000_0001'], 'error');
		}

		var txt="There was an error on this page.\r\n";
		txt+="Message: " + msg + "\r\n";
		txt+="URL: " + url + "\r\n";
		txt+="Line: " + line + "\r\n";
		LoggerWrapper.error(txt);
			
		return true;
	}

	/** 默认的全局错误处理方法
	  * option : 成功用各种消息
	  *		title : 标题
	  *		msg : 弹出的消息
	  */
	function DefaultHandleSuccessShow(option)
	{
		$.messager.show({
			title: option.title,
			msg: option.msg,
			timeout: Constants.showInfoWindow.showTime,
			showType: Constants.showInfoWindow.showType
		});
	}

});