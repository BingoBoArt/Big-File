/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1609165272351_2668'

  // 配置文件存储路径
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

  // 配置文件上传的类型
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  }

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: false,
    },
    jwt: {
      secret: 'bingo123',
    },
    // 正常nuxt连接本地mongo需要这个配置，但是我这个本地的mongo不需要这个配置，反而加上这个配置会连接不上，不知为何
    // mongoose:{
    //   client:{
    //     url: 'mongodb://127.0.0.1:27017/bingohub',
    //     option:{}
    //   }
    // }

    /**
     * @需要在router.js文件中配置下面的一坨才能正常连接本地的数据库
      const mongoose = require('mongoose');
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useUnifiedTopology', true)
      mongoose.connect('mongodb://127.0.0.1:27017/bingohub');
      const con = mongoose.connection;
      con.on('error', console.error.bind(console, '连接数据库失败'));
      con.once('open', () => {
        console.log('连接成功');
      });
    */

  }
}
