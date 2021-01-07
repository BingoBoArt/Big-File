// 封装 解析token的中间件， 也可以用egg-jwt
const jwt = require('jsonwebtoken')

// 内部使用的变量大部分是koa中间件的写法
module.exports = app => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorzation) {
      // 没有token--》 用户没有登录
      ctx.body = {
        code: -666,
        message: '用户没有登录',
      }
      return
    }
    const token = ctx.request.header.authorzation.replace('Bearer ', '')
    console.log('中年件：', token)
    try {
      const ret = await jwt.verify(token, app.config.jwt.secret)
      // 把用户信息存到session中，也就是 ctx.state上，这样就可以在info接口处通过 ctx.state 取到email
      ctx.state.email = ret.email
      ctx.state.userid = ret._id
      await next() // next() 是koa中间件的写法
    } catch (error) {
      console.log('error', error)
      if (error.name == 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '登陆过期',
        }
      } else {
        ctx.body = {
          code: -666,
          message: '用户信息出错',
        }
      }
    }
  }
}
