import Tool from '../common/tool';

module.exports = {
  post: async function (request, response, next) {
    return Tool.returnData(response, request.files);
  }
};

