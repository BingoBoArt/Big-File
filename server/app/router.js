'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect('mongodb://127.0.0.1:27017/bingohub')
const con = mongoose.connection
con.on('error', console.error.bind(console, '连接数据库失败'))
con.once('open', () => {
  console.log('连接成功')
})

module.exports = app => {
  const { router, controller } = app
  // 在app/middleware/jwt中创建的解析token的函数中间件，在这里调用
  // 传入app，返回值赋给 jwt，目的：在/info接口使用这个中间件，使用方法：把 jwt 放到 router.get('/info', jwt, info) 中间
  const jwt = app.middleware.jwt(app)
  router.get('/', controller.home.index)

  // 请求图片验证码的接口
  router.get('/captcha', controller.utils.captcha)

  // 请求邮箱验证码
  router.get('/sendcode', controller.utils.sendcode)

  router.post('/uploadfile', controller.utils.uploadfile)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { login, register, verify, info } = controller.user
    router.post('/login', login)
    router.post('/register', register)
    router.get('/verify', verify)
    router.get('/info', jwt, info)
  })
}
