/**
 * Created by PandaApe on 07/05/2017.
 * Email: whailong2010@gmail.com
 */

const fs = require('fs-extra');
const mustache = require('mustache');

const extractIPA = require('ipa-extract-info');//获取ipa信息
const path = require('path');
const AdmZip = require('adm-zip');
const uuidV4 = require('uuid/v4');

const apkParser3 = require("apk-parser3");

require('shelljs/global');

const enviConfig = require('./../../config/envi_config');

const pushNotiService = require('./pushNoti_service');

const appInfoModel = require('./../model/appInfo_model')

const AppInfoError = require('./../error/appInfo_error');


String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
};


let listAllProds = async (platform, pageNo, pageSize) => {

    const result = await appInfoModel.listAllProds(platform, pageNo, pageSize);
    return mapIconAndUrl(result);
};

let listSpecificProd = async (prodType, envType, platform, pageNo, pageSize) => {

    var result;
    if (envType === 4) {
        result = await appInfoModel.listProdArchivePackage(prodType, platform, pageNo, pageSize);
    } else {
        result = await appInfoModel.listSpecificProd(prodType, envType, platform, pageNo, pageSize);
    }

    return mapIconAndUrl(result);
};

let deleteApp = async (itemId) => {

    // 1. 删除文件 2. 删除数据库记录

    const appItems = await appInfoModel.retrieveApps(itemId);

    const appItem = appItems[0];

    if (!appItem) {

        throw AppInfoError.AppNotFoundError('itemId app不存在');
    }

    var appFileName = '';
    if (appItem.platform === 1) {

        appFileName = enviConfig.serverDir + '/ipa/' + appItem.itemId + '.ipa';
    } else {

        appFileName = enviConfig.serverDir + '/apk/' + appItem.itemId + '.apk';
    }

    const iconName = enviConfig.serverDir + '/icon/' + appItem.itemId + '.png';

    // remove file
    await new Promise((resolve, reject) => {

        fs.remove(appFileName, err => {

            if (err) {

                reject(err);

            } else {

                resolve();
            }


        })

    }).catch(function (err) {

        throw err;
    });

    await new Promise((resolve, reject) => {

        fs.remove(iconName, err => {

            if (err) {

                reject(err);

            } else {

                resolve();
            }


        })

    }).catch(function (err) {
        throw err;
    });

    await appInfoModel.deleteApp(itemId);
};

let uploadApp = async (platform, prodType, envType, packagePath, changeLog) => {

    var itemInfo = {};
    itemInfo.changeLog = changeLog;
    itemInfo.itemId = uuidV4();
    itemInfo.prodType = prodType;
    itemInfo.envType = envType;
    itemInfo.createdDate = new Date();
    itemInfo.updatedDate = new Date();

    var parsePackage, extractIcon;

    if (platform === 1) {

        parsePackage = parseIpa;
        extractIcon = extractIpaIcon;
    } else {

        parsePackage = parseApk;
        extractIcon = extractApkIcon;
    }
    /*

     1. parse Package
     2. parse icon
     3. store package
     4. save to db
     5. post notification

     */

    //1.
    itemInfo = await parsePackage(packagePath, itemInfo);

    //2.
    await extractIcon(packagePath, itemInfo);

    //3.
    await  storeApp(packagePath, itemInfo);

    //4.
    await appInfoModel.insertAppInfoToDB(itemInfo);

    //5. notification  异步调用，不管推送是否成功
    pushNotiService.pushAppUploadSuccess(itemInfo);

    return mapIconAndUrl(itemInfo);

};


let generatePlist = async (itemId) => {

    const items = await  appInfoModel.retrieveApps(itemId);

    if (items.length === 0) {
        throw AppInfoError.AppNotFoundError(itemId + '未找到');
    }

    const item = items[0];


    return await new Promise((resolve, reject) => {

        fs.readFile(path.join(__dirname, '../supportingFiles') + '/template.plist', function (err, data) {
            if (err) reject(err);

            var template = data.toString();
            const rendered = mustache.render(template, {
                itemId: itemId,
                name: item.displayName,
                bundleID: item.appIdentifier,
                basePath: enviConfig.hostURL,
            });

            resolve(rendered);
        })
    });

};


function storeApp(fileName, itemInfo) {

    return new Promise((resolve, reject) => {

        var new_path;

        const serverDir = enviConfig.serverDir;
        const ipasDir = serverDir + "/ipa";
        const apksDir = serverDir + "/apk";
        if (itemInfo.platform === 1) {

            new_path = path.join(ipasDir, itemInfo.itemId + ".ipa");
        } else {

            new_path = path.join(apksDir, itemInfo.itemId + ".apk");
        }


        itemInfo.fileSize = fs.statSync(fileName).size;
        fs.move(fileName, new_path, error => {

            if (error) {

                reject(error);
            } else {

                resolve(itemInfo);
            }
        });
    });
}

function parseIpa(filename, itemInfo) {
    return new Promise(function (resolve, reject) {

        const fd = fs.openSync(filename, 'r');
        extractIPA(fd, function (err, info, raw) {

            if (err) {

                printLog('extracIPA error' + err);

                reject(err);
            }

            var data = info[0];
            itemInfo.platform = 1;

            itemInfo.buildVersion = data.CFBundleVersion;
            itemInfo.displayName = data.CFBundleDisplayName;
            itemInfo.version = data.CFBundleShortVersionString;
            itemInfo.appIdentifier = data.CFBundleIdentifier;

            resolve(itemInfo)
        });
    });
}

function parseApk(filename, itemInfo) {
    return new Promise(function (resolve, reject) {

        apkParser3(filename, function (err, data) {
            var package = parseText(data.package);

            itemInfo.platform = 2;

            itemInfo.buildVersion = package.versionCode;
            itemInfo.displayName = data["application-label"].replace(/'/g, "");
            itemInfo.version = package.versionName;
            itemInfo.appIdentifier = package.name;

            resolve(itemInfo)
        });
    });
}

function parseText(text) {
    var regx = /(\w+)='([\w\.\d]+)'/g
    var match = null, result = {}
    while (match = regx.exec(text)) {
        result[match[1]] = match[2]
    }
    return result
}

function extractApkIcon(filename, itemInfo) {

    var itemId = itemInfo.itemId;

    return new Promise(function (resolve, reject) {
        apkParser3(filename, function (err, data) {
            var iconPath = false;
            [640, 320, 240, 160].every(i => {
                if (typeof data["application-icon-" + i] !== 'undefined') {
                    iconPath = data["application-icon-" + i];
                    return false;
                }
                return true;
            });
            if (!iconPath) {
                reject("can not find icon ");
            }

            iconPath = iconPath.replace(/'/g, "")
            var tmpOut = enviConfig.serverDir + '/icon' + "/{0}.png".format(itemId)
            var zip = new AdmZip(filename);
            var ipaEntries = zip.getEntries();
            var found = false
            ipaEntries.forEach(function (ipaEntry) {
                if (ipaEntry.entryName.indexOf(iconPath) != -1) {
                    var buffer = new Buffer(ipaEntry.getData());
                    if (buffer.length) {
                        found = true
                        fs.writeFile(tmpOut, buffer, function (err) {
                            if (err) {
                                reject(err)
                            }
                            resolve(itemInfo)
                        })
                    }
                }
            })
            if (!found) {
                reject("can not find icon ")
            }
        });
    })
}

function extractIpaIcon(filename, itemInfo) {
    var itemId = itemInfo.itemId;
    return new Promise(function (resolve, reject) {

        var tmpOut = enviConfig.serverDir + '/icon' + "/{0}.png".format(itemId)
        var zip = new AdmZip(filename);
        var ipaEntries = zip.getEntries();
        var exeName = '';
        if (process.platform == 'darwin') {
            exeName = '../supportingFiles/pngdefry-osx';
        } else {
            exeName = '../supportingFiles/pngdefry-linux';
        }

        var found = false;
        ipaEntries.forEach(function (ipaEntry) {
            if (ipaEntry.entryName.indexOf('AppIcon60x60@2x.png') != -1) {
                found = true;
                var buffer = new Buffer(ipaEntry.getData());
                if (buffer.length) {
                    fs.writeFile(tmpOut, buffer, function (err) {
                        if (err) {
                            reject(err)
                        } else {
                            var execResult = exec(path.join(__dirname, exeName + ' -s _tmp ') + ' ' + tmpOut)
                            if (execResult.stdout.indexOf('not an -iphone crushed PNG file') != -1) {
                                resolve(itemInfo)
                            } else {
                                fs.remove(tmpOut, function (err) {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        var tmp_path = enviConfig.serverDir + '/icon' + "/{0}_tmp.png".format(itemId)
                                        fs.rename(tmp_path, tmpOut, function (err) {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                resolve(itemInfo)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
        if (!found) {
            reject("can not find icon ")
        }
    })
}

function mapIconAndUrl(result) {

    var dataList;

    if (result instanceof Array) {

        dataList = result;
    } else {

        dataList = [result];
    }

    dataList.map(function (item) {

        item.iconUrl = "{0}/icon/{1}.png".format(enviConfig.hostURL, item.itemId);

        if (item.platform === 1) {

            item.downloadUrl = "itms-services://?action=download-manifest&url={0}/plist/{1}".format(enviConfig.hostURL, item.itemId);
        } else if (item.platform === 2) {

            item.downloadUrl = "{0}/apk/{1}.apk".format(enviConfig.hostURL, item.itemId);
        }

        return item;
    });

    return result;
}


module.exports = {

    listAllProds,
    listSpecificProd,
    deleteApp,
    uploadApp,
    generatePlist
};