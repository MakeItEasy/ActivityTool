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

4. 系统配置(日志路径的配置)  
文件：js/LoggerWrapper.js  
修改内容：logFilePath : 'e:\\01_moyan\\12_GitHubHome\\ActivityTool\\logs\\ActivityTool.log',  
将以上内容中的路径修改为自己本地数据库的绝对路径。  

安装完毕!

注：如果希望以hta的形式运行，那么运行 bats/createHtaApp.bat，  
即可生成ActivityTool.hta文件，双击生成的文件即可运行。

## Screenshot

* 人员一览截图
![人员一览](/screenshot/PeopleList.png)
* 活动一览截图
![活动一览](/screenshot/ActivityList.png)
* 新建活动截图
![新建活动](/screenshot/ActivityNew.png)

