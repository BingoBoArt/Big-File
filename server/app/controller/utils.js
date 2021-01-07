const svgCaptcha = require('svg-captcha')
const BaseController = require('./base')

const fse = require('fs-extra')


class UtilsController extends BaseController {
  // 通过svgCaptcha插件生成随机数验证码
  async captcha() {
    const { ctx } = this
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 3,
      fontSize: 50,
      height: 50,
      width: 100,
      background: '#cc9966',
    })
    console.log('验证码：', captcha.text)
    ctx.session.captcha = captcha.text
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }

  // 邮箱验证码
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱：', email, '验证码：', code)
    //   把这个随机数 挂到  ctx.session 上，这样在 server/app/controller/user.js/login()方法中就可以通过 ctx.session拿到这个code
    ctx.session.emailcode = code

    const subject = '大波'
    const text = ''
    const html = `<h2>大波基地</h2><a href='www.dabo.org'><span>${code}</span></a>`

    // 需要注册一个service, 在 /app下创建一个service文件，这里会自动引入这个service问价并且在this上可以访问
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.success({ code })
    } else {
      this.error('邮箱验证码发送失败')
    }
  }

  // 上传文件接口
  async uploadfile() {
    const { ctx } = this
    /**
         * 在config.default.js中配置文件上传的类型
         * 如果不配置，则请求上传文件的接口不能上传文件类型的数据，
         * 导致 ctx.request.files 这个里边拿不到数据
         * config.multipart = { mode: 'file',whitelist: () => true}
        */
    console.log('uploadfile', ctx.request.files[0])
    const file = ctx.request.files[0]
    // 收到文件后，把文件存储到public文件下
    // 需要在config.default.js中配置 路径 -》upload-dir
    // file.filepath -> 上传过来的文件的临时目录
    // upload_dir -> 要存放的目标目录
    const upload_dir = `${this.config.UPLOAD_DIR}/${file.filename}`
    // fse 插件操作文件比 fs 功能多一些
    await fse.move(file.filepath, upload_dir)
    // 浏览器中可以访问这个图片资源地址：http://localhost:7001/public/88888.jpg
    const visitUrl = `/public/${file.filename}`
    this.success({
      url: visitUrl,
    })

  }
}

module.exports = UtilsController
