var mysql = require('mysql');
var Config = require('./config');
/**
 * @author Horange create on 2016/11/25
 * @file 数据库操作类
 */
module.exports = {
  /**
   * 连接数据库
   * @returns {*} 数据库连接
   */
  connect: function () {
    var connection = mysql.createConnection({
      host: Config.dbHost,
      user: Config.dbUser,
      password: Config.dbPassword,
      database: Config.database
    });
    connection.connect();
    return connection;
  },
  /**
   * 查询分页列表
   * @param sql 查询sql
   * @param order 排序
   * @param page 当前页
   * @param pageSize 每页条数
   * @param count 是否获取总记录数
   * @returns {*} Promise对象
   */
  list: function (sql, order = "", page = 1, pageSize = 20, count = false) {
    var it = this;
    var querySql = sql;
    if (order) {
      querySql = querySql + " ORDER BY " + order;
    }
    querySql = querySql + " LIMIT " + (page - 1) * pageSize + "," + pageSize;
    console.log(querySql);
    return new Promise(function (resolve, reject) {
      it.query(querySql).then(function (res) {
        var obj = {
          page: page,
          pageSize: pageSize,
          querySql: querySql,
          rows: res
        };
        if (count) {
          var countSql = "SELECT COUNT(1) AS countNum FROM (" + sql + ") countTable";
          it.query(countSql).then(function (res2) {
            var countNum = 0;
            if (res2.length > 0 && res2[0]["countNum"]) {
              countNum = parseInt(res2[0]["countNum"]);
            }
            obj.records = countNum;
            obj.total = parseInt(countNum / pageSize) + 1;
            resolve(obj);
          }, function (err2) {
            reject(err2);
          });
        } else {
          resolve(obj);
        }
      }, function (err) {
        reject(err);
      });
    });

  },
  /**
   * 数据库查询操作
   * @param sql 查询sql
   * @returns {*} Promise对象
   */
  query: function (sql) {
    var it = this;
    var connect = it.connect();
    return new Promise(function (resolve, reject) {
      var stime = new Date();
      connect.query(sql, function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          var dtime = new Date();
          console.log("querySql[" + (dtime.getTime() - stime.getTime()) / 1000 + "s]:", sql);
          resolve(rows);
        }
      });
      connect.end();
    });
  },
  /**
   * 数据库sql执行操作
   * @param sql 执行sql
   * @returns {*} Promise对象
   */
  exec: function (sql) {
    var it = this;
    var connect = it.connect();
    return new Promise(function (resolve, reject) {
      connect.query(sql, function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      connect.end();
    });
  },
  /**
   * 删除数据
   * @param mtable 查询表
   * @param filter 过滤条件
   * @returns {*} Promise对象
   */
  del: function (mtable, filter) {
    var it = this;
    var sql = "DELETE FROM " + mtable + " WHERE " + filter;
    var connect = it.connect();
    console.log("delSql:", sql);
    return new Promise(function (resolve, reject) {
      connect.query(sql, function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      connect.end();
    });
  },
  /**
   * 查询详情
   * @param sql 查询sql
   * @returns {*} Promise对象
   */
  info: function (sql) {
    var it = this;
    sql = sql + " LIMIT 0,1";
    var connect = it.connect();
    console.log("infoSql:", sql);
    return new Promise(function (resolve, reject) {
      connect.query(sql, function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          console.log(rows);
          var str = JSON.stringify(rows);
          rows = JSON.parse(str);
          if (rows.length > 0) {
            resolve(rows[0]);
          } else {
            resolve(rows);
          }
        }
      });
      connect.end();
    });
  },
  /**
   * 更新数据
   * @param mtable 查询表
   * @param dataMap 要更新的数据
   * @param keyCol 表主键
   * @returns {*} Promise对象
   */
  update: function (mtable, dataMap, keyCol) {
    var it = this;
    var sql = "";
    var keyValue = "";
    if (dataMap[keyCol] == undefined || dataMap[keyCol] == "") {
      sql = "INSERT INTO " + mtable + " SET ?";
    } else {
      keyValue = dataMap[keyCol];
      delete dataMap[keyCol];
      var arr = [];
      for (var i in dataMap) {
        arr.push(i + "='" + dataMap[i] + "'");
      }
      sql = "UPDATE " + mtable + " SET " + arr.join(",") + " WHERE " + keyCol + "='" + keyValue + "'";
    }
    console.log("updateSql:", sql);
    var connect = it.connect();
    return new Promise(function (resolve, reject) {
      connect.query(sql, dataMap, function (err, rows, fields) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          if (keyValue == "" && rows.insertId) {
            keyValue = rows.insertId;
          }
          if (!keyValue) {
            resolve(rows);
          } else {
            var sql = "SELECT * FROM " + mtable + " WHERE " + keyCol + " = " + keyValue;
            it.info(sql).then(function (res2) {
              resolve(res2);
            }, function (err2) {
              reject(err2);
            });
          }
        }
      });
      connect.end();
    });
  },
  /**
   * 批量更新，暂时循环处理，性能后期优化，TODO
   * @param mtable 查询表
   * @param listMap 要更新的数据数组
   * @param keyCol 表主键
   * @returns {*} Promise对象
   */
  updateBatch: function (mtable, listMap, keyCol) {
    var it = this;
    var updateBatchSql = "";
    var updateDataList = [];
    for (var lindex in listMap) {
      var dataMap = listMap[lindex];
      var keyValue = "";
      if (dataMap[keyCol] == undefined || dataMap[keyCol] == "") {
        updateDataList.push(dataMap);
        updateBatchSql = "INSERT INTO " + mtable + " SET ?";
      } else {
        keyValue = dataMap[keyCol];
        delete dataMap[keyCol];
        var arr = [];
        var arrVal = [];
        for (var j in dataMap) {
          arr.push("`" + j + "`=?");
          arrVal.push(dataMap[j]);
        }
        arrVal.push(keyValue);
        updateDataList.push(arrVal);
        updateBatchSql = "UPDATE " + mtable + " SET " + arr.join(",") + " WHERE " + keyCol + "=?";
      }
    }
    var connect = it.connect();
    return new Promise(function (resolve, reject) {
      for (var item of updateDataList) {
        connect.query(updateBatchSql, item, function (err, rows, fields) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(rows);
          }
        });
      }
      connect.end();
    });
  },
  /**
   * 查询表字段信息
   * @param mtable 查询表
   * @returns {*} Promise对象
   */
  fields: function (mtable) {
    var it = this;
    var sql = "SHOW FULL FIELDS FROM " + mtable;
    return new Promise(function (resolve, reject) {
      it.query(sql).then(function (res) {
        resolve(res);
      }, function (err) {
        reject(err);
      });
    });
  },
  toJoinMap: function (mtable) {
    var map = {};
    var arr = [];
    if (mtable.indexOf('join') == -1) {
      map = {
        table: mtable.trim(),
        alias: mtable.trim(),
        join: []
      };
      return map;
    }
    mtable = mtable.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    var joinSplit = mtable.split('join');
    map['table'] = joinSplit[0].substring(0, joinSplit[0].indexOf(' '));
    var str = joinSplit[0].replace('inner', '').replace('left', '').replace('right', '').replace('outer', '').trim();
    map['alias'] = str.substring(str.lastIndexOf(' ', str.length - 2)).trim();
    for (var j = 1; j < joinSplit.length; j++) {
      var joinStr = joinSplit[j];
      var lr = joinSplit[j - 1].substring(joinSplit[j - 1].lastIndexOf(' ', joinSplit[j - 1].length - 2)).trim();
      var join = joinStr.substring(0, joinStr.indexOf(' ', 1)).trim();
      var onSplit = joinStr.split('on')
      if (onSplit.length !== 2) {
        console.error('mtable字符串有误', mtable);
      }
      var alias = onSplit[0].substring(onSplit[0].lastIndexOf(' ', onSplit[0].length - 2)).trim();
      var link = onSplit[1].replace('inner', '').replace('left', '').replace('right', '').replace('outer', '').trim();
      arr.push({
        lr: lr,
        join: join,
        alias: alias,
        link: link
      });
    }
    map['join'] = arr;
    return map;
  },
}