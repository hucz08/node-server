# node-server
node-restful-api-server 

技术栈：

express+pm2+sequlize+es7


start:

1.import /sql/test.sql to your mysql database

2.npm install

3.npm run dev

4.http://localhost:3033/api/test


接口定义遵循Restful风格规范，其中：

1 GET 获取，幂等，请求指定页面信息，并返回实体主体

2 HEAD 类似于GET请求，只不过返回的响应中没有具体的内容，用于获取报头

3 POST 新增，非幂等，向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。POST请求可能会导致新的资源的建立和/或已有资源的修改。

4 PUT 修改，幂等，多次执行后资源不变，从客户端向服务器传送的数据取代指定的文档的内容。（全部取代）

5 PATCH 修订，非幂等，每次执行后资源可能改变，从客户端向服务器传送的数据取代指定的文档的内容。（部分取代）

6 DELETE 删除，幂等，请求服务器删除指定的页面。

7 CONNECT HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。

8 OPTIONS 允许客户端查看服务器的性能。

9 TRACE 回显服务器收到的请求，主要用于测试或诊断。

如 GET /api/test?filter[name]=nnn&filter[number]=bbbb&isCount=true&pageSize=20&page=1&order= id DESC 表示获取列表数据

GET /api/test?id=aaaasfsdfsdf 表示获取详情数据

POST /api/test 表示新增数据

PUT /api/test 表示编辑数据

DELETE /api/test?id=sdfdsgdg 表示删除数据

xxx-api.js:书写规范：

1.文件采用数据库表名或模块名-api.js命名

2.方法名采用驼峰法命名，以请求方式开头，如 get post put delete

3.如果函数中需要使用async await的，需要增加async await关键字声明

4.使用Tool.checkParam(request,[[]])，获取参数值并对参数进行校验

5.使用Tool.returnError(response,msg,400)，返回错误信息

6.使用Tool.returnData(response,res)，返回接口数据

7.使用try{} catch (err){}包裹代码主题部分，以获取程序异常信息

8.对于复杂或者可复用的逻辑代码处理部分，可将相应的逻辑抽离到xxx-service.js中
