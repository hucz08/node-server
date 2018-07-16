module.exports = {
  validate: {
    required: 'required',
    int: 'int',
    bool: 'bool',
    object: 'object',
    array: 'array',
    number: 'number',
    string: 'string',
    date: 'date',
    dateTime: 'dateTime',
    email: 'email',
    personNo: 'personNo',
    idCard: 'personNo',
    url: 'url',
    mobile: 'mobile',
    tel: 'tel'
  },
  /**
   * 日期格式化
   * @param date 日期对象或字符串
   * @param fmt 格式化字符串 默认"yyyy-MM-dd HH:mm:ss"  y:年份,M:月份,d:日期,H:小时,m:分,s:秒,S:毫秒,q:季度,E:星期,h:12小时制小时
   * @returns {*} 格式化后的字符串
   */
  formatDate (date, fmt) {
    var it = this;
    if (!date instanceof Date) {
      date = it.toDate(date);
    }
    if (typeof fmt !== 'string') {
      fmt = "yyyy-MM-dd HH:mm:ss";
    }
    if (null == date) {
      return "";
    }
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S+": date.getMilliseconds() //毫秒
    };
    var week = {"0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六"};
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  },
  /**
   * 获取URL参数
   */
  getUrlParam: function (url) {
    if (url.indexOf("?") === -1) {
      return {};
    }
    var paraString = url.substring(url.lastIndexOf("?") + 1, url.length).split("&"),
      paraObj = {};
    var i, j;
    for (i = 0; j = paraString[i]; i++) {
      var key = j.substring(0, j.indexOf("="));
      var value = j.substring(j.indexOf("=") + 1, j.length);
      value = value ? value.split("#")[0] : "";
      paraObj[key] = decodeURIComponent(value);
    }
    return paraObj;
  },
  /**
   * 转换成URL参数
   */
  toUrlParam (obj) {
    var arr = [];
    for (var i in obj) {
      arr.push(i + "=" + obj[i]);
    }
    return arr.join("&");
  },
  /**
   * 转换为对象
   */
  toJson (str) {
    var it = this;
    var json = {};
    if (!str) {
      return json;
    } else if (typeof str === "string") {
      try {
        var ss = str.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
        json = eval("json=" + ss);
      } catch (err) {
        console.error("toJsonErr:" + it.toString(err));
      } finally {
        return json;
      }
    } else {
      return str;
    }
  },
  /**
   * 转换为日期对象
   */
  toDate (str) {
    if (typeof str === 'number') {
      return new Date(str);
    } else if (!isNaN(str)) {
      if (str.indexOf(".") !== -1 || str.length <= 10) {
        //如果单位为秒，则乘以1000
        return new Date(str * 1000);
      } else {
        return new Date(str * 1);
      }
    } else if (typeof str === 'string') {
      var date = new Date(str.replace(/-/g, "/"));
      return date;
    } else {
      return str;
    }
  },
  /**
   * obj转换成字符串
   * @param {type} obj
   */
  toString (json) {
    var it = this;
    var type = typeof json;
    var res = json;
    if (!json || type === 'string') {
      res = json + "";
    } else if (typeof json === "number") {
      res = json + "";
    } else if (json instanceof Array) {
      res = JSON.stringify(json);
    } else if (json instanceof Date) {
      res = it.formatDate(json);
    } else if (type === 'object') {
      res = JSON.stringify(json);
    } else {
      res = json;
    }
    return res;
  },
  /**
   * 转换为驼峰法命名
   * @param str
   * @returns {string | void | *}
   */
  toCamelCase: function (str) {
    var re = /-(\w)/g
    return str.replace(re, function ($0, $1) {
      return $1.toUpperCase()
    })
  },
  /**
   * 将驼峰发转换为字符连接
   * @param str
   * @param char
   * @returns {string | *}
   */
  toCharCase: function (str, char) {
    char = char || '-'
    str = str.replace(/([A-Z])/g, char + '$1').toLowerCase()
    return str
  },
  /**
   * 对象转换为过滤条件
   * @param map
   * @returns {string}
   */
  toFilter: function (map) {
    var arr = [];
    for (var key in map) {
      var value = map[key];
      var split = value.split(',')
      if (value && split.length == 2) {
        arr.push(key + ' >= \'' + split[0] + '\' and ' + key + ' <= ' + '\'' + split[1] + '\'')
      } else {
        arr.push(key + ' = \'' + value + '\'')
      }
    }
    return arr.join(' and ');
  },
  /**
   * 判断是否为空，0不为空
   */
  isNull: function (obj) {
    if (obj === undefined || obj === null || obj === "") {
      return true;
    } else if (typeof obj == "object") {
      for (var i in obj) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  },
  /**
   * 是否为数字
   * @param str
   * @returns {boolean}
   */
  isNumber: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^[\d]+[\.]?[\d]*$/)) {
      return true;
    }
    return false;
  },
  /**
   * 是否为int型
   * @param str
   * @returns {boolean}
   */
  isInt: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^[\d]+$/)) {
      return true;
    }
    return false;
  },
  /**
   * 是否是邮箱格式
   * @param str
   * @returns {boolean}
   */
  isEmail: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)) {
      return true;
    }
    return false;
  },
  /**
   * 是否是手机号
   * @param str
   * @returns {boolean}
   */
  isMobile: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^1[3-9]{1}[\d]{9}$/)) {
      return true;
    }
    return false;
  },
  /**
   * 是否是座机号码
   * @param str
   * @returns {boolean}
   */
  isTel: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^[0]{1}[\d]{10}$/)) {
      return true;
    }
    return false;
  },
  /**
   * 是否是身份证号
   * @param str
   * @returns {boolean}
   */
  isPersonNO: function (str) {
    var it = this;
    if (it.isNull(str)) {
      return false;
    }
    str = it.toString(str);
    if (str.match(/^(\d{18,18}|\d{15,15}|\d{17,17}x)$/)) {
      return true;
    }
    return false;
  },
  /**
   * 参数校验["username", "用户名", "testname","required", "Integer", "Number"]
   *  参数含义：参数key    参数名称  默认值     条件格式...
   */
  checkParam: function (request, paramArr) {
    var it = this;
    console.log(request.method, request.url);
    var params = request.query;
    Object.assign(params, request.body);
    console.log(params);
    var isOk = true;
    var sb = [];
    for (var item of paramArr) {
      var key = item[0];
      var label = item[1];
      var defValue = item[2];
      var value = params[key];
      if (it.isNull(value)) {
        value = params[key] = defValue;
      }
      for (var i = 3; i < item.length; i++) {
        var str = (item[i] + "").toLowerCase().trim();
        if (str.startsWith("regx(")) {
          var regx = str.substring(5, str.length - 1);
          if (!str.match(regx)) {
            isOk = false;
            sb.push(label + "格式不正确");
          }
        }
        if (str == "required") {
          if (it.isNull(value)) {
            isOk = false;
            sb.push(label + "不能为空");
          }
        }
        if (!it.isNull(value)) {
          if (str == "number") {
            if (!it.isNumber(value)) {
              isOk = false;
              sb.push(label + "必须是数字");
            } else {
              params[key] = Number(value);
            }
          } else if (str == "integer" || str == "int") {
            if (!it.isInt(value)) {
              isOk = false;
              sb.push(label + "必须是整数");
            } else {
              params[key] = Math.floor(Number(value));
            }
          } else if (str == "object" || str == "map") {
            value = it.toJson(value);
            if (typeof value != "object" || value.length !== undefined) {
              isOk = false;
              sb.push(label + "必须是对象");
            } else {
              params[key] = value;
            }
          } else if (str == "array" || str == "arr") {
            value = it.toJson(value);
            if (typeof value != "object" || value.length === undefined) {
              isOk = false;
              sb.push(label + "必须是数组");
            } else {
              params[key] = value;
            }
          } else if (str == "boolean" || str == "bool") {
            if (value == true || value == 1 || value == "true" || value == "1") {
              value = true;
            } else if (value == false || value == 0 || value == "false" || value == "0") {
              value = false;
            } else {
              isOk = false;
              sb.push(label + "必须是布尔类型");
            }
            params[key] = value;
          } else if (str == "email") {
            if (!it.isEmail(value)) {
              isOk = false;
              sb.push(label + "必须是邮箱格式");
            }
          } else if (str == "mobile" || str == "phone") {
            if (!it.isMobile(value)) {
              isOk = false;
              sb.push(label + "必须是手机号格式");
            }
          } else if (str == "personno" || str == "idcard") {
            if (!it.isPersonNO(value)) {
              isOk = false;
              sb.push(label + "必须是15位或18位身份证");
            }
          } else if (str == "tel" || str == "telephone" || str == "call") {
            if (!it.isTel(value)) {
              isOk = false;
              sb.push(label + "必须是座机号码格式");
            }
          } else {

          }
        }
      }
    }
    params.isOk = isOk;
    params.msg = sb.join(",");
    return params;
  },
  getFirstWords: function (str) {
    return str.split(/[`~!@#\$%\^\s\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im)[0];
  },
  getSortType: function (str) {
    var res = "";
    if (str == "int" || str == "tinyint" || str == "int" || str == "smallint") {
      res = "int";
    } else if (str == "decimal") {
      res = "number";
    } else if (str == "char" || str == "varchar" || str == "enum") {
      res = "string";
    } else if (str == "text") {
      res = "editor";
    } else if (str == "datetime" || str == "timestamp") {
      res = "datetime";
    } else {
      console.log(res, str);
      res = str;
    }
    return res;
  },
  returnData: function (response, obj, code = 200) {
    var data = {
      code: code,
      data: obj
    };
    return response.send(data);
  },
  returnError: function (response, obj = "", code = 400) {
    var err = {
      code: code,
      msg: obj
    }
    console.error(err);
    return response.send(err);
  }
}
