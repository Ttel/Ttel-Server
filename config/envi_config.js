/**
 * Created by PandaApe on 05/05/2017.
 * Email: whailong2010@gmail.com
 */

const osHomeDir = require('os-homedir')();
// 开发环境的配置内容
const devConfig = {

    env: 'dev',                 //环境名称
    port: 8873,                 //服务端口号
    httpPort: 8863,             //HTTP服务端口号
    serverDir: osHomeDir + '/.ttel-dev-server',  //数据文件地址，不要以/结尾
    mysql: {

        host: '172.16.88.230',  //mysql主机地址
        user: 'ttel',           //登录用户
        password: 'rjs123',     //登录密码
        database: 'ttel-dev'    //数据库
    },

    JPush: {                    //极光推送
        appKey: '',
        masterSecret: ''
    },

    email: {
        host: 'smtp.163.com',                // SMTP服务器
        secureConnection: true,              // 使用SSL方式（安全方式，防止被窃取信息）
        port:465,
        auth: {
            user: '',
            pass: ''
        }
    },

    hostURL: ''               //** 主机URL, 用于下载地址拼接。请保持空值
};

// 生产环境的配置内容
const proConfig = {

    env: 'pro',                 //环境名称
    port: 8874,                 //服务端口号
    httpPort: 8864,             //HTTP服务端口号

    serverDir: osHomeDir + '/.ttel-pro-server',  //数据文件地址，不要以/结尾

    mysql: {

        host: '172.16.88.230',  //mysql主机地址
        user: 'ttel',           //登录用户
        password: 'rjs123',     //登录密码
        database: 'ttel-pro'        //数据库
    },

    JPush: {
        appKey: '',
        masterSecret: ''
    },

    email: {
        host: 'smtp.163.com',                // smtp服务器
        secureConnection: true,              // 使用SSL方式（安全方式，防止被窃取信息）
        port:465,
        auth: {
            user: '',
            pass: ''
        }
    },

    hostURL: ''
};

//根据不同的NODE_ENV，输出不同的配置对象，默认输出dev的配置对象
module.exports = {

    dev: devConfig,
    pro: proConfig
}[process.env.NODE_ENV || 'dev'];