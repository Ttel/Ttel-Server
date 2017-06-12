const log4js = require('log4js');

const log_config = require('../../config/log_config');
const ApiError = require('./../error/api_error');
//加载配置文件
log4js.configure(log_config);

const logUtil = {};

const errorLogger = log4js.getLogger('errorLogger');
const resLogger = log4js.getLogger('resLogger');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
const formatRes = function (ctx, resTime) {
    var logText = '';

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    console.log(logText);

    return logText;

}

//格式化错误日志
const formatError = function (ctx, err, resTime) {
    var logText = '';

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    console.log(logText);

    return logText;
};

//格式化请求日志
const formatReqLog = function (req, resTime) {

    var logText = '';

    const method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;

    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
    } else {

        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    }

    logText += 'request header: ' + JSON.stringify(req.header) + "\n";

    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
};


module.exports = () => {
    return async (ctx, next) => {
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        var ms;
        try {
            //开始进入到下一个中间件
            await next();

            ms = new Date() - start;
            //记录响应日志
            logUtil.logResponse(ctx, ms);

        } catch (error) {

            ms = new Date() - start;
            //记录异常日志
            logUtil.logError(ctx, error, ms);

            console.log(error);
        }

    }
};
