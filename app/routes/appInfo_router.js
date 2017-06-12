/**
 * Created by PandaApe on 07/05/2017.
 * Email: whailong2010@gmail.com
 */

const router = require('koa-router')();

const appInfoController = require('../controllers/appInfo_controller');

router.get('/listAllProds', appInfoController.listAllProds);

router.get('/listSpecificProd', appInfoController.listSpecificProd);

router.delete('/delete', appInfoController.deleteApp);

router.post('/upload', appInfoController.uploadApp);

router.post('/emailqa', appInfoController.mailToQA);

module.exports = router;
