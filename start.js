// 服务端支持es6,es7
require("babel-core/register");
// 服务器
var express = require('express');
// 文件上传
var multipart = require('connect-multiparty');
// 文件读写
var fs = require('fs');
// 读取body的json数据
var bodyParser = require('body-parser');
// 跨域访问
var cors = require('cors');
var app = express();
var multipartMiddleware = multipart();
app.use(bodyParser());
app.use(cors());
app.use(multipart({uploadDir: './uploads'}));
var routes = fs.readdirSync('./src/api');
for (var file of routes) {
  if (file.endsWith('-api.js')) {
    var name = file.replace('.js', "");
    var api = require('./src/api/' + name);
    for (var key in api) {
      var methods = ['get', 'post', 'put', 'delete'];
      for (var mndex = 0; mndex < methods.length; mndex++) {
        var method = methods[mndex];
        if (key.startsWith(method)) {
          var model = name.substring(0, name.lastIndexOf('-api'));
          var str = key.substring(method.length);
          var action = '/api/' + model;
          if (str && str.length > 0) {
            action = '/api/' + model + '/' + str[0].toLowerCase() + str.substring(1);
          }
          console.log(method, model, action);
          var register = (function (app, method, action, api, key, model) {
            app[method](action, multipartMiddleware, function (req, res, next) {
              if (!api['model'] || api['model'] == 'base') {
                api['model'] = model;
              }
              if (!api['keyCol']) {
                api['keyCol'] = 'id';
              }
              (api[key])(req, res, next);
            });
          })(app, method, action, api, key, model);
          break;
        }
      }
    }
  }
}
app.get('/', function (req, res) {
  res.send('Hello World...');
});
app.get('*', function (req, res) {
  res.send('404');
});
var port = 3033;
app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==>Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
