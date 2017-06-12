/**
 * Created by PandaApe on 09/05/2017.
 * Email: whailong2010@gmail.com
 */


const router = require('koa-router')();

const appInfoController = require('../controllers/appInfo_controller');

router.get('/:itemId', appInfoController.generatePlist);

module.exports = router;
