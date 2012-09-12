## ActivityTool

The tool to manage the activity information.

## Install

安装过程如下：  

1. 安装sqliteodbc.exe。  
下载地址: http://www.ch-werner.de/sqliteodbc/  

2. 得到env/JMail.dll文件，然后注册该组件。  
（该组件是用来发送邮件用的，如果不注册这个组件，那么发送邮件功能无法使用，其他功能正常。）  
注册方法：  
（1）将其复制到**system32**目录下  
（2）在MS－DOS下执行以下命令即可  
`regsvr32 JMail.dll`

3. 系统配置(数据库路径的配置)  
文件：js/DBUtil.js  
修改内容：dbPath : "e:\\01_moyan\\12_GitHubHome\\ActivityTool\\database\\ActivityTool.db",  
将以上内容中的路径修改为自己本地数据库的绝对路径。  
备注：由于下载的文件中，database文件的名字为ActivityTool_init.db，所以要注意把最后的_init删除掉。  

4. 系统配置(日志路径的配置)  
文件：js/LoggerWrapper.js  
修改内容：logFilePath : 'e:\\01_moyan\\12_GitHubHome\\ActivityTool\\logs\\ActivityTool.log',  
将以上内容中的路径修改为自己本地数据库的绝对路径。  
 
5. 系统配置(邮件相关配置)  
文件：js/MailSender.js  
修改内容：var MailSender = {
按照要求修改以上定义中的内容。主要是服务器地址，用户名，密码。  


安装完毕!

注：如果希望以hta的形式运行，那么运行 bats/createHtaApp.bat，  
即可生成ActivityTool.hta文件，双击生成的文件即可运行。

