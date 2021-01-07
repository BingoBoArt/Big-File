const { Controller } = require('egg')

class BaseController extends Controller {
  success(data) {
    // console.log('BaseController', data);
    this.ctx.body = {
      code: 0,
      data,
    }
  }
  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    }
  }
  error(message, code = -1, errors = {}) {
    this.ctx.body = {
      message,
      errors,
      code,
    }
  }
}


module.exports = BaseController
