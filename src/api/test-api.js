import BaseApi from '../api/base-api';
import BaseService from '../service/base-service';
import Tool from '../common/tool';

module.exports = {
  ...BaseApi,
  model: 'test',
  keyCol: 'id',
  getTest: async function (request, response, next) {
    var it = this;
    // 一对多中需要带出子列表的，需要加载子模型，并且subCols中填写子模型配置的列表的输出别名,如子列表需要过滤的，则增加where
    var Test = BaseService.loadModel('test');
    var res = await BaseService.list('base', '', '', 1, 20, false, [{
      model: Test,
      as: 'testList',
      where: {
        id: '9447dc28-6f10-44a5-8c89-bd9cf14e0a3f'
      }
    }]);
    return Tool.returnData(response, res);
  },
  beforeList: function (reqData) {
    return reqData;
  },
};

