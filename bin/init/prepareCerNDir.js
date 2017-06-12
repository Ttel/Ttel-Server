/**
 * Created by PandaApe on 09/05/2017.
 * Email: whailong2010@gmail.com
 */


require('shelljs/global');
const fs = require('fs-extra');
const os = require('os');
const underscore = require('underscore');
const path = require('path');
const enviConfig = require('../../config/envi_config');
const logConfig = require('../../config/log_config');

function createDirIfNeeded(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

function getHostIPAddress() {

    return underscore.chain(os.networkInterfaces())
        .values().flatten().find(function (iface) {
            return iface.family === 'IPv4' && iface.internal === false;
        }).value().address;
}

/**
 * 初始化log相关目录
 */
function initLogPath() {
    //创建log的根目录'logs'
    if (logConfig.baseLogPath) {
        createDirIfNeeded(logConfig.baseLogPath)
        //根据不同的logType创建不同的文件目录
        for (var i = 0, len = logConfig.appenders.length; i < len; i++) {
            if (logConfig.appenders[i].path) {
                createDirIfNeeded(logConfig.baseLogPath + logConfig.appenders[i].path);
            }
        }
    }
}


const serverDir = enviConfig.serverDir;
const cerDir = serverDir + '/cer';
const ipaDir = serverDir + '/ipa';
const apkDir = serverDir + '/apk';
const iconDir = serverDir + '/icon';

createDirIfNeeded(serverDir);
createDirIfNeeded(cerDir);
createDirIfNeeded(ipaDir);
createDirIfNeeded(apkDir);
createDirIfNeeded(iconDir);

initLogPath()

exec('sh  ' + path.join(__dirname, './cer/generate-certificate.sh') +
    ' ' + getHostIPAddress() + ' ' + enviConfig.serverDir + '/cer').output;




