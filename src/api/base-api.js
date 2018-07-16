import BaseService from '../service/base-service';
import Tool from '../common/tool';

/**
 * @author Horange create on 2016/11/25
 * @file 基本控制器类
 */
module.exports = {
  model: "base",
  keyCol: "id",
  /**
   * 查询列表前操作，供子类复写
   * @param reqData
   * @returns {*}
   */
  beforeGet: function (reqData) {
    return reqData;
  },
  get: async function (request, response, next) {
    var it = this;
    try {
      var reqData = Tool.checkParam(request, [
        [it.keyCol, "ID", "", Tool.validate.string],
        ["filter", "过滤条件", {}, Tool.validate.object],
        ["order", "排序", it.keyCol + " DESC", Tool.validate.string],
        ["page", "当前页", 1, Tool.validate.int],
        ["pageSize", "每页条数", 20, Tool.validate.int],
        ['isCount', "是否查询记录数", false, Tool.validate.bool],
      ]);
      if (!reqData.isOk) {
        return Tool.returnError(response, reqData.msg, 400);
      }
      reqData = it.beforeGet(reqData);
      var res = [];
      if (reqData[it.keyCol]) {
        res = await BaseService.getInfoByKeyValue(it.model, reqData[it.keyCol], it.keyCol);
      } else {
        res = await BaseService.list(it.model, reqData.filter, reqData.order, reqData.page, reqData.pageSize, reqData.isCount);
      }
      res = it.afterGet(reqData, res);
      return Tool.returnData(response, res);
    } catch (err) {
      return Tool.returnError(response, err, 405);
    }
  },
  /**
   * 查询列表后操作，供子类复写
   * @param reqData
   * @param res
   * @returns {*}
   */
  afterGet: function (reqData, res) {
    return res;
  },
  /**
   * 删除数据前操作，供子类复写
   * @param reqData
   * @returns {*}
   */
  beforeDelete: function (reqData) {
    return reqData;
  },
  /**
   * 删除数据操作，不建议子类复写
   * @param request
   * @param response
   * @param next
   * @returns {*}
   */
  delete: async function (request, response, next) {
    var it = this;
    try {
      var reqData = Tool.checkParam(request, [
        [it.keyCol, "ID", "", Tool.validate.string],
        ["filter", "过滤条件", {}, Tool.validate.object]
      ]);
      if (!reqData.isOk) {
        return Tool.returnError(response, reqData.msg, 400);
      }
      reqData = it.beforeDelete(reqData);
      if (reqData[it.keyCol]) {
        reqData.filter[it.keyCol] = reqData[it.keyCol];
      }
      var res = await BaseService.delete(it.model, reqData.filter);
      res = it.afterDelete(reqData, res);
      return Tool.returnData(response, res);
    } catch (err) {
      return Tool.returnError(response, err, 405);
    }
  },
  /**
   * 删除数据后操作，供子类复写
   * @param reqData
   * @param res
   * @returns {*}
   */
  afterDelete: function (reqData, res) {
    return res;
  },
  /**
   * 新增数据前操作，供子类复写
   * @param reqData
   * @returns {*}
   */
  beforePost: function (reqData) {
    return reqData;
  },
  /**
   * 新增数据操作，不建议子类复写
   * @param request
   * @param response
   * @param next
   * @returns {*}
   */
  post: async function (request, response, next) {
    var it = this;
    try {
      var reqData = Tool.checkParam(request, [
        ["dataMap", "新增数据", {}, Tool.validate.required, Tool.validate.object]
      ]);
      if (!reqData.isOk) {
        return Tool.returnError(response, reqData.msg, 400);
      }
      reqData = it.beforePost(reqData);
      var res = await BaseService.create(it.model, reqData['dataMap']);
      res = it.afterPost(reqData, res);
      return Tool.returnData(response, res);
    } catch (err) {
      return Tool.returnError(response, err, 405);
    }
  },
  /**
   * 新增数据后操作，供子类复写
   * @param reqData
   * @param res
   * @returns {*}
   */
  afterPost: function (reqData, res) {
    return res;
  },
  /**
   * 修改数据前操作，供子类复写
   * @param reqData
   * @returns {*}
   */
  beforePut: function (reqData) {
    return reqData;
  },
  /**
   * 修改数据操作，不建议子类复写
   * @param request
   * @param response
   * @param next
   * @returns {*}
   */
  put: async function (request, response, next) {
    var it = this;
    try {
      var reqData = Tool.checkParam(request, [
        ["dataMap", "修改数据", {}, Tool.validate.required, Tool.validate.object],
        ["filter", "过滤条件", {}, Tool.validate.object]
      ]);
      if (!reqData.isOk) {
        return Tool.returnError(response, reqData.msg, 400);
      }
      reqData = it.beforePut(reqData);
      var res = await BaseService.update(it.model, reqData['dataMap'], reqData['filter']);
      res = it.afterPut(reqData, res);
      return Tool.returnData(response, res);
    } catch (err) {
      return Tool.returnError(response, err, 405);
    }
  },
  /**
   * 修改数据后操作，供子类复写
   * @param reqData
   * @param res
   * @returns {*}
   */
  afterPut: function (reqData, res) {
    return res;
  },
};
