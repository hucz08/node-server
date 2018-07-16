import DBUtil from '../common/db-util';
import ORM from '../common/orm';

const modelMap = {};
/**
 * @author Horange create on 2016/11/25
 * @file 基本服务类
 */
module.exports = {
  loadModel: function (model) {
    if (!modelMap[model]) {
      var Model = require('../model/' + model);
      // var Model = ORM.import('../model/auto/' + model);
      modelMap[model] = Model;
      console.log('load--', model);
    }
    return modelMap[model];
  },
  /**
   * 查询详情
   * @param model
   * @param value
   * @param key
   * @param subCols 子列表别名（用于查询一对多关系数据）如['testList']
   * 需要在model中配置 1 对 多关系
   * Bean.belongsTo(Base, {as: 'base', foreignKey: 'baseId'});
   * Base.hasMany(Bean, {as: tableName + 'List', foreignKey: 'baseId'});
   * @returns {Promise<*>}
   */
  getInfoByKeyValue: async function (model, value, key = 'id', subCols = []) {
    var filter = {};
    filter[key] = value;
    var res = await this.list(model, filter, '', 1, 1, false, subCols);
    if (res && res.length > 0) {
      res = res[0];
    } else {
      res = {};
    }
    return res;
  },
  /**
   * 查询数据
   * @param model
   * @param filter
   * @param order
   * @param page
   * @param pageSize
   * @param isCount
   * @param subCols 子列表别名（用于查询一对多关系数据）如['testList']
   * 需要在model中配置 1 对 多关系
   * Bean.belongsTo(Base, {as: 'base', foreignKey: 'baseId'});
   * Base.hasMany(Bean, {as: tableName + 'List', foreignKey: 'baseId'});
   * @returns {Promise<{}>}
   */
  list: async function (model, filter, order, page = 1, pageSize = 20, isCount = false, subCols = []) {
    var Model = this.loadModel(model);
    var filterMap = {};
    var include = [];
    var orderArr = [];
    // console.log(Model.rawAttributes);
    for (var key in Model.rawAttributes) {
      var field = Model.rawAttributes[key];
      if (field && field.references) {
        if (key.endsWith('Id')) {
          include.push(key.substring(0, key.length - 2));
        } else {
          include.push(key);
        }
      }
      if (filter[key] != undefined) {
        filterMap[key] = filter[key];
      }
    }
    if (subCols && subCols.length > 0) {
      for (var i = 0; i < subCols.length; i++) {
        if (subCols[i] && include.indexOf(subCols[i]) == -1) {
          include.push(subCols[i]);
        }
      }
    }
    if (order) {
      var orderSplit = order.split(',');
      for (var i = 0; i < orderSplit.length; i++) {
        if (orderSplit[i]) {
          orderArr.push(orderSplit[i].split(' '));
        }
      }
    }
    console.log('include', include);
    var findOption = {
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
      order: orderArr,
      where: filterMap,
      include: include
    };
    var res = {};
    if (isCount == 'true' || isCount == true) {
      res = await Model.findAndCount(findOption);
    } else {
      res = await Model.findAll(findOption);
    }
    return res;
  },
  /**
   * 删除数据
   * @param model
   * @param filter
   * @returns {Promise<*>}
   */
  delete: async function (model, filter = {}) {
    var Model = this.loadModel(model);
    var filterMap = {};
    for (var key in Model.rawAttributes) {
      if (filter[key] != undefined) {
        filterMap[key] = filter[key];
      }
    }
    var res = await Model.destroy({
      where: filterMap
    });
    return res;
  },
  /**
   * 新增数据
   * @param model
   * @param dataMap
   * @returns {Promise<*>}
   */
  create: async function (model, dataMap = {}) {
    var Model = this.loadModel(model);
    var beanMap = {};
    for (var key in Model.rawAttributes) {
      if (dataMap[key] != undefined) {
        beanMap[key] = dataMap[key];
      }
    }
    var res = await Model.create(beanMap);
    return res;
  },
  /**
   * 修改数据
   * @param model
   * @param dataMap
   * @param filter
   * @returns {Promise<*>}
   */
  update: async function (model, dataMap = {}, filter = {}) {
    var Model = this.loadModel(model);
    var filterMap = {};
    var beanMap = {};
    for (var key in Model.rawAttributes) {
      if (filter[key] != undefined) {
        filterMap[key] = filter[key];
      }
      if (dataMap[key] != undefined) {
        beanMap[key] = dataMap[key];
      }
    }
    var res = await Model.update(beanMap, {
      where: filterMap
    });
    return res;
  },
  /**
   * 执行SQL
   * @param sql
   * @returns {Promise<*>}
   */
  query: async function (sql) {
    var res = await ORM.query(sql);
    return res;
  },
  /**
   * 查询表字段信息
   * @param mtable 查询表
   * @returns {*} Promise对象
   */
  fields: function (mtable) {
    return DBUtil.fields(mtable);
  },
};