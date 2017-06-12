/**
 * 在app.use(router)之前调用
 */

var {ApiError, AppInfoError} = require('../error/index');

/**
 * 在app.use(router)之前调用
 */
var response_formatter = (ctx) => {

    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        ctx.body = {
            code: 1,
            msg: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 1,
            msg: 'success'
        }
    }
}

var url_filter = (pattern) => {

    return async (ctx, next) => {

        const reg = new RegExp(pattern);

        try {
            //先去执行路由
            await next();
        } catch (error) {

            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if (error instanceof ApiError) {

                ctx.status = 200;
                ctx.body = {

                    code: error.code,
                    msg: error.message
                };

            } else {

                ctx.status = 200;
                ctx.body = {

                    code: -1000,
                    msg: '服务器内部错误'
                };
            }


            //继续抛，让外层中间件处理日志
            throw error;
        }

        //通过正则的url进行格式化处理
        if (reg.test(ctx.originalUrl) && ctx.status === 200) {

            response_formatter(ctx);
        }
    }
}

// module.exports = response_formatter;
module.exports = url_filter;