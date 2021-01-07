const { Service } = require('egg')

const nodemailer = require('nodemailer')
// 服务端发起邮件的邮箱用163邮箱时，qq邮箱和163邮箱都可收到邮件
// 服务端发起邮件的邮箱用126邮箱时，qq邮箱可以收到，163邮箱和126邮箱收不到邮件
const userMail = 'langbingo@126.com'
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userMail,
    pass: 'YPSWOCVUPPKPVSMB', // 开启服务后，使用这个授权码才可以第三方登录
  },
  // 解决这个问题： email error Error: Invalid login: 550 User has no permission
  // 进入邮箱-》设置-》POP3/SMTP/IMAP -》开启服务 -》 按照提示扫码发短息 -》用给我的唯一安全码  替换掉  邮箱的密码 ->
  // 就可以在代码中发送邮件了
  // https://blog.csdn.net/Hughnes/article/details/52070878
  // https://cloud.tencent.com/developer/article/1691579
})

// 继承一下egg的service，就可以了
class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOption = {
      from: userMail,
      // cc: userMail,
      to: '1374011601@qq.com',
      subject, text, html,
    }
    try {
      await transporter.sendMail(mailOption)
      return true
    } catch (error) {
      console.log('email error', error)
      return false
    }
  }
}


module.exports = ToolService
