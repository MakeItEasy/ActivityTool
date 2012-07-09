//////////////////////////////////////////////////////////
///               默认使用的一些模板部分                ///
//////////////////////////////////////////////////////////

var header1 = "大家好！" + Constants.enterKey + Constants.enterKey;
var footer1 = Constants.enterKey + Constants.enterKey;
footer1 += "以上报告完毕。" + Constants.enterKey;
footer1 += "刘妍" + Constants.enterKey;
footer1 += new Date().format() + Constants.enterKey;
footer1 += "-------------------------------------------------------------" + Constants.enterKey;
footer1 += "如果您不想再收到此类邮件，" + Constants.enterKey;
footer1 += "请与刘妍（liuyan@use.com.cn）联系。" + Constants.enterKey;
footer1 += "-------------------------------------------------------------";



/** 埋字说明部分
  * %N : Activity Name
  * %D : Date
  * %K : Activity Kind
  * %P : People List
  * %C : 场地数量
  * %H : 参加人数
  * %G : 消费金额
  * %I : 明细清单
  * %J : 账户余额
  */


var MailTemplate = {};


//////////////////////////////////////////////////////////
///               邀请函模板部分                        ///
//////////////////////////////////////////////////////////
MailTemplate.WelcomeTemplate = new MailMessage();

MailTemplate.WelcomeTemplate.title = "【邀请函】%N";

MailTemplate.WelcomeTemplate.header = header1;

MailTemplate.WelcomeTemplate.content  = "今定于[%D]举行%K活动。有意者请回复Mail确认。" + Constants.enterKey;
MailTemplate.WelcomeTemplate.content += "谢谢配合！";

MailTemplate.WelcomeTemplate.footer  = footer1;


//////////////////////////////////////////////////////////
///               确认函模板部分                        ///
//////////////////////////////////////////////////////////
MailTemplate.MakesureTemplate = new MailMessage();

MailTemplate.MakesureTemplate.title = "【确认函】%N";

MailTemplate.MakesureTemplate.header = header1;

MailTemplate.MakesureTemplate.content  = "%C片场地预定成功。" + Constants.enterKey;
MailTemplate.MakesureTemplate.content += "参赛人员名单如下：" + Constants.enterKey + Constants.enterKey;
MailTemplate.MakesureTemplate.content += "%P";

MailTemplate.MakesureTemplate.footer  = footer1;


//////////////////////////////////////////////////////////
///               结算清单模板部分                      ///
//////////////////////////////////////////////////////////
MailTemplate.PayTemplate = new MailMessage();

MailTemplate.PayTemplate.title = "【结算清单】%N";

MailTemplate.PayTemplate.header = header1;

MailTemplate.PayTemplate.content  = "此次活动结算清单如下:" + Constants.enterKey + Constants.enterKey;
MailTemplate.PayTemplate.content += "参加人数：[%H人]" + Constants.enterKey;
MailTemplate.PayTemplate.content += "消费金额：[%G元]" + Constants.enterKey + Constants.enterKey;
MailTemplate.PayTemplate.content += "==================明细清单======================" + Constants.enterKey;
MailTemplate.PayTemplate.content += "%I" + Constants.enterKey;
MailTemplate.PayTemplate.content += "==================账户余额======================" + Constants.enterKey;
MailTemplate.PayTemplate.content += "%J";

MailTemplate.PayTemplate.footer  = footer1;
// 结算清单一条数据模板
MailTemplate.PayTemplate.PayListItemFormat = "{0}.{1}    [{2}元]";
// 余额清单一条数据模板
MailTemplate.PayTemplate.RechangeListItemFormat = "{0}.{1}    [{2}元]";


//////////////////////////////////////////////////////////
///               取消函模板部分                       ///
//////////////////////////////////////////////////////////
MailTemplate.CancelTemplate = new MailMessage();

MailTemplate.CancelTemplate.title = "【取消函】%N";

MailTemplate.CancelTemplate.header = header1;

MailTemplate.CancelTemplate.content  = "很遗憾，原定于[%D]举行的%K活动已取消。" + Constants.enterKey;
MailTemplate.CancelTemplate.content += "请周知！";

MailTemplate.CancelTemplate.footer  = footer1;




