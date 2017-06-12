/**
 * 整合所有子路由
 */
const router = require('koa-router')();
const appInfo = require('./appInfo_router');
const plistRouter = require('./plist_router');

router.use('/apiv1/app', appInfo.routes(), appInfo.allowedMethods());
router.use('/plist', plistRouter.routes(), plistRouter.allowedMethods());

module.exports = router;
