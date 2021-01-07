const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const hashSalt = 'bingo@zuibang'
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
}

class UserController extends BaseController {

  async login() {
    // app默认是在server/config/config.default.js中配置
    const { ctx, app } = this
    const { email, passwd, captcha, emailCode } = ctx.request.body
    console.log('login', ctx.request.body)
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    // 在 server/app/controller/utils.js/sendcode() 方法下挂载的这个随机数 ，在这里取出来，用于邮箱验证码校验
    console.log('emailcode-----', ctx.session.emailcode)
    if (emailCode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误')
    }
    const user = await this.ctx.model.User.findOne({
      email,
      passwd: md5(passwd + hashSalt),
    })
    if (!user) {
      return this.error('用户名密码不存在')
    }

    // 使用jwt，生成token返回前端
    const token = jwt.sign({ _id: user._id, email }, app.config.jwt.secret, { expiresIn: '1h' })
    // 密码一致,登陆成功
    this.success({ token, email, nickname: user.nickname })
  }

  async register() {
    const { ctx } = this
    const { email, nickname, passwd, captcha } = ctx.request.body
    console.log('传递的参数', email, nickname, passwd, captcha)
    try {
      // 校验传递的参数
      ctx.validate(createRule)
    } catch (e) {
      // console.log('校验失败:', e);
      return this.error('参数错误', -1, e.errors)
    }
    console.log('ctx:', ctx.session.captcha)
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (await this.checkEmail(email)) {
      this.error('邮箱重复了')
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        passwd: md5(passwd + hashSalt),
      })
      if (ret._id) {
        this.message('注册成功!')
      }
    }

  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }

  async verify() {

  }

  async info() {
    // const userInfo = await this.decodedJwt()
    // middleware/jwt.js中已经把在接口开始对请求头的token做了验证并把解析出来的token中的信息存到ctx.state上
    const { email } = this.ctx.state
    const userInfo = await this.checkEmail(email)
    // 这里取到的用户信息包含数据库查到的该用户所有信息，但是密码等不应该返回给前端，可以在model/user.js中设置某个字段select:false即可
    this.success(userInfo)
  }

  async decodedJwt() {
    // 最好是在middleware中实现这个解析token的中间件，在middleware中实现的中间件可以在router.js中的接口处直接使用
    const { ctx, app } = this
    // 在请求中获取header中的 Authorzation 字段中的token，用中间件解析这个token，拿到用户信息
    // 再用这个信息去数据库查该用户的详细信息，返回
    console.log('ctx.request.body', ctx.request.header.authorzation.replace('Bearer ', ''))
    const token = ctx.request.header.authorzation.replace('Bearer ', '')
    const decodedJwt = await jwt.verify(token, app.config.jwt.secret)
    const { email } = decodedJwt
    const userInfo = await this.ctx.model.User.findOne({ email })
    console.log('userInfo:', userInfo)
    return userInfo
  }
}

module.exports = UserController
