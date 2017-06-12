/**
 * Created by PandaApe on 09/05/2017.
 * Email: whailong2010@gmail.com
 */

const nodemailer = require('nodemailer');
const enviConfig = require('./../../config/envi_config');
const appInfoModel = require('./../model/appInfo_model');
const AppInfoError = require('./../error/appInfo_error');

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
};

let mailToQA = async (itemIds, receivers, from, subject, remark) => {

    const mailTransport = nodemailer.createTransport(enviConfig.email);

    const items = await appInfoModel.retrieveApps(itemIds);

    if (items.length === 0) {

        throw AppInfoError.AppNotFoundError('App 未找到');
    }
    const item = items[0];

    const platform = item.platform === 1 ? 'iOS' : 'Android';
    const appName = item.displayName;
    const appVersion = item.version;

    const subjectStr = "[" + appName + "] (" + platform + ") " + appVersion + "版本 归档包下载";

    var row = '';

    for (var i in items) {

        var itemInfo = items[i];


        var envType = "";
        switch (itemInfo.envType) {
            case 1:
                envType = "SIT";
                break;
            case 2:
                envType = "UAT";
                break;
            case 3:
                envType = "PRO";
                break;
        }

        const packDir = itemInfo.platform === 1 ? "/ipa/" : "/apk/";
        const fileExtName = itemInfo.platform === 1 ? ".ipa" : ".apk";

        const appFileName = enviConfig.hostURL + packDir + itemInfo.itemId + fileExtName;


        row +=
            '<tr>' +
            '<td>' + platform + '</td>' +
            '<td>' + itemInfo.displayName + '</td>' +
            '<td>' + itemInfo.version + '</td>' +
            '<td>' + itemInfo.buildVersion + '</td>' +
            '<td>' + envType + '</td>' +
            '<td><a href="' + appFileName + '">点我下载</a></td>' +
            '</tr>';
    }

    //TODO: need optimize, should provide html template.
    const html = '<!DOCTYPE html><html><head><style>table {    font-family: arial, sans-serif;    border-collapse: collapse;    width: 100%;}td, th {    border: 1px solid #dddddd;    text-align: left;    padding: 8px;}</style>' +
        '</head><body> <p> 您要归档包已备好：</p>  <p></p> <table>  <tr>    <th>平台</th>    <th>名称</th>       <th>版本</th>            <th> 编译版本号</th>         <th>环境</th>            <th>下载</th>  </tr> ' +
        row + '</table><p>Have a nice day :)</p></body></html>';


    const options = {
        from: "Ttel-移动端测试分发平台<" + enviConfig.email.auth.user + ">",
        to: receivers.join(','),
        subject: subjectStr,
        html: html
    };
    return await new Promise((resolve, reject) => {

        mailTransport.sendMail(options, function (err, msg) {

            if (err) {

                reject({note: '发送失败'});
            }
            else {
                resolve({note: '发送成功'});

            }
        });
    });
};

module.exports = {

    mailToQA
};