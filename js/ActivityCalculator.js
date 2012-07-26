define(function(require, exports, module) {

	var LoggerWrapper = require('./LoggerWrapper.js');
	var Constants = require('./Constants.js');

	// 活动结算工具
	var ActivityCalculator = {
		calculate : defaultCalculate
	};

	// 得到控制台Logger对象
	function defaultCalculate(activity) {
		// 用现金方式结算的现金总额
		var sumMoney = 0;
		// 按照100%每个人应该支付的金额
		var singlePay = 0;
		// 所有折扣信息的总和
		var sumDiscount = 0;
		var memberInfo;
		for(var i=0; i<activity.activity_members.length; i++) {
			memberInfo = activity.activity_members[i];
			if(memberInfo.pay_pattern == Constants.activityPayPattern[0].patternId) {
				// 折扣方式
				sumDiscount += (Number(memberInfo.pay_pattern_info)*(1+Number(memberInfo.friend_number)));
			} else {
				// 现金方式
				sumMoney += (Number(memberInfo.pay_pattern_info)*(1+Number(memberInfo.friend_number)));
			}
		}
		
		LoggerWrapper.debug("[defaultCalculate] sumMoney: " + sumMoney);
		LoggerWrapper.debug("[defaultCalculate] sumDiscount: " + sumDiscount);
		
		if(sumMoney > activity.activity_cost) {
			// 如果现金方式的总额已经大于总花费的情况
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0010');
		}
		if(sumMoney < activity.activity_cost && sumDiscount <= 0) {
			// 折扣信息输入错误
			throw new Error(Constants.errorNumber.defaultNumber, 'E_A_00_000_0011');
		}
		
		// 单价的计算
		singlePay = (activity.activity_cost - sumMoney)/sumDiscount;
		LoggerWrapper.debug("[defaultCalculate] singlePay: " + singlePay);
		
		// 应付金额的设定
		for(var i=0; i<activity.activity_members.length; i++) {
			memberInfo = activity.activity_members[i];
			if(memberInfo.pay_pattern == Constants.activityPayPattern[0].patternId) {
				// 折扣方式
				memberInfo.pay_number = singlePay*Number(memberInfo.pay_pattern_info)*(1+Number(memberInfo.friend_number));
			} else {
				// 现金方式
				memberInfo.pay_number = Number(memberInfo.pay_pattern_info)*(1+Number(memberInfo.friend_number));
			}
		}
	}

	return ActivityCalculator;
});