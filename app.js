const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const serve = require('koa-static');

const logUtil = require('./app/middleWares/log_util');
const resFormatter = require('./app/middleWares/response_formatter');
const enviConfig = require('./config/envi_config');

//routes
const routerIndex = require('./app/routes');

// error handler
onerror(app);

// koaBody
app.use(koaBody({
    multipart: true,
    formidable: {
        keepExtensions: true
    }
}));

// app.use(logger());
app.use(serve(__dirname + '/public'));
app.use(serve(enviConfig.serverDir));

app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

// logger
app.use(logUtil());

//添加格式化处理响应结果的中间件，在添加路由之前调用
//仅对/api开头的url进行格式化处理
app.use(resFormatter('^/api'));

// routes
app.use(routerIndex.routes(), routerIndex.allowedMethods());

module.exports = app;
