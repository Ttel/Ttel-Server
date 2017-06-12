/**
 * Created by PandaApe on 09/05/2017.
 * Email: whailong2010@gmail.com
 */

const enviConfig = require('./../../config/envi_config');

const JPush = require("jpush-sdk")
const client = JPush.buildClient(enviConfig.JPush.appKey, enviConfig.JPush.masterSecret);


let pushAppUploadSuccess = async (itemInfo) => {

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

    const pushClient = client.push().setAudience(JPush.tag(enviConfig.env === 'dev' ? 'sit' : 'pro'));

    if (itemInfo.platform === 1) {//如果是iOS平台

        pushClient.setPlatform("ios");
        if (itemInfo.aldSendProNoti == undefined) {
            /**
             setOptions    设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)。
             */
            console.log("apns_production: true")
            pushClient.setOptions(null, null, null, true)
        } else {
            console.log("apns_production: false")
            pushClient.setOptions(null, null, null, false)

        }

        if (itemInfo.aldSendProNoti == undefined) {

            itemInfo.aldSendProNoti = false;
            //这里触发一次递归调用
            await  pushAppUploadSuccess(itemInfo);//发送Dev通知
        }

    } else {//如果是Android平台

        pushClient.setPlatform("android");
    }

    const msg = itemInfo.displayName + " " + envType + "包已更新\n版本： v" + itemInfo.version + "(" + itemInfo.buildVersion + ")";

    pushClient.setNotification('Ttel', JPush.ios(msg, "mid123", "+1"), JPush.android(msg, null, 1))

        .send(function (err, res) {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message)
                    // Response Timeout means your request to the server may have already received,
                    // please check whether or not to push
                    console.log(err.isResponseTimeout)
                } else if (err instanceof JPush.APIRequestError) {
                    console.log(err.message)
                }
            } else {
                console.log('push successfully~ Msg_id:' + res.msg_id);
            }
        })
}

module.exports = {pushAppUploadSuccess};