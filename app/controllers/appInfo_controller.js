/**
 * Created by PandaApe on 05/05/2017.
 * Email: whailong2010@gmail.com
 */

const AppInfoError = require('./../error/appInfo_error');

const appInfoService = require('./../service/appInfo_service');

const mailService = require('./../service/email_service');

let listAllProds = async (ctx, next) => {

    const pageNo = parseInt(ctx.query.pageNo);
    if (!pageNo) {

        throw AppInfoError.ParamError('pageNo 参数错误');
    }

    var pageSize = parseInt(ctx.query.pageSize);
    if (!pageSize || pageSize === 0) {

        pageSize = 10;
    }

    const platform = parseInt(ctx.query.platform);
    if (!platform) {

        throw AppInfoError.ParamError('platform 参数错误');
    }

    ctx.body = await appInfoService.listAllProds(platform, pageNo, pageSize);
};

let listSpecificProd = async (ctx, next) => {
    //pageNo pageSize platform

    const platform = parseInt(ctx.query.platform);
    if (!platform) {

        throw AppInfoError.ParamError('platform 参数错误');

    }

    const prodType = parseInt(ctx.query.prodType);
    if (!prodType) {

        throw AppInfoError.ParamError('prodType 参数错误');
    }

    const pageNo = parseInt(ctx.query.pageNo);
    if (!pageNo) {

        throw AppInfoError.ParamError('pageNo 参数错误');
    }

    var pageSize = parseInt(ctx.query.pageSize);
    if (!pageSize || pageSize === 0) {

        pageSize = 10;
    }

    const envType = parseInt(ctx.query.envType);
    if (!envType) {

        throw AppInfoError.ParamError('envType 参数错误');
    }


    ctx.body = await appInfoService.listSpecificProd(prodType, envType, platform, pageNo, pageSize);


};

let deleteApp = async (ctx, next) => {

    const itemId = ctx.query.itemId;
    if (!itemId) {

        throw AppInfoError.ParamError('itemId 参数错误');
    }

    await appInfoService.deleteApp(itemId);

    ctx.body = {};

};

let uploadApp = async (ctx, next) => {

    const fields = ctx.request.body.fields;

    const envType = parseInt(fields.envType);
    if (isNaN(envType) || envType > 5) {

        throw AppInfoError.ParamError('envType 参数错误');
    }

    const prodType = parseInt(fields.prodType);
    if (isNaN(prodType)) {

        throw AppInfoError.ParamError('prodType 参数错误');
    }

    const changeLog = fields.changeLog;

    const package = ctx.request.body.files.package;

    if (!package) {

        throw AppInfoError.ParamError('package 参数错误');
    }

    var platform;

    if (package.path.split('.').pop() === "ipa") {

        platform = 1;
    } else if (package.path.split('.').pop() === "apk") {

        platform = 0;
    } else {

        throw AppInfoError.ParamError('package 文件类型错误');
    }

    ctx.body = await appInfoService.uploadApp(platform, prodType, envType, package.path, changeLog);
};

let mailToQA = async (ctx, next) => {


    var fields = ctx.request.body.fields;
    if (!fields){

        fields = ctx.request.body;
    }

    const itemIds = fields.itemIds;

    if (!(itemIds instanceof Array) || itemIds.count === 0) {

        throw AppInfoError.ParamError('itemIds 参数错误');
    }

    const receivers = fields.receivers;

    if (!(receivers instanceof Array) || receivers.count === 0) {

        throw AppInfoError.ParamError('receivers 参数错误');
    }

    ctx.body = await mailService.mailToQA(itemIds, receivers, fields.from, fields.subject, fields.remark);
};

let generatePlist = async (ctx, next) => {

    const itemId = ctx.params.itemId;

    if (!itemId) {

        throw AppInfoError.ParamError('itemId 参数错误');
    }

    ctx.body = await appInfoService.generatePlist(itemId);

};

module.exports = {

    listAllProds,
    listSpecificProd,
    deleteApp,
    uploadApp,
    mailToQA,
    generatePlist
};