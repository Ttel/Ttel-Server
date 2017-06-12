# Ttel-Server

## 接口字段说明：


| 字段名  | 说明  |示例 |
|----------|--------|----|
|**changeLog**| 更新日志| 增加邮件发送功能|
|**itemId**| 包的ID, 每次上传的包都会生成一个唯一的ID，即使传的是同一个ipa或者apk文件 | 4af47af5-92ca-4f6c-a4d0-d0f3cdd56471
|**prodType**|  产品类型码,不同产品，对应的产品ID | 1031
|**envType**| 包环境类型, 1：SIT  2：UAT  3：PRO|
|**platform**| 平台 1：iOS  2：Android | 
|**buildVersion**| 编译版本号 | 2017060503
|**displayName**| 产品名称 | Ttel
| **version**| 产品版本| 1.2
| **appIdentifier**| iOS为bundleID, Android为包名| com.tencent.wechat
| **iconUrl**| 图片下载地址 | https://172.16.88.230:8874/icon/4af47af5-92ca-4f6c-a4d0-d0f3cdd56471.png
|**downloadUrl**| 包的下载地址| Android: https://172.16.88.123:8383/apk/75a8c69c43134.apk, iOS:itms-services://?action=download-manifest&url=https://172.16.88.230:8874/plist/13dea4ae-69f0-42e2-beab-11e576d061fc
|**updatedDate**| 更新时间|2017-06-12T03:45:37.000Z
| **createdDate**|包上传时间 |2017-06-12T03:45:57.000Z,
|**fileSize**| 安装包大小| 33345197
|**pageSize**|分页大小，默认为10| 20
|**pageNo**|页码，从1开始的正整数| 1


## 上传应用
**POST**:  apiv1/app/upload

**Request:**

| 请求	| 必填 | 参数	| [类型]/限制	| 示例	|
|-----|----|---|--------|----|
1 | 必填 | package | [int] | 无 |
1 | 必填 | envType | [int]| 无 |
1 | 必填 | prodType | [int]| 无 |
1 | 选填 | changeLog | [text]| 无 |

**Response:**	

```json
	{
    "msg":"SUCCESS",
    "code":1,
    "data":{
        "changeLog":"changeLogchangeLogchangeLogchangeLog",
        "itemId":"9a344aeb-2057-4f78-9134-3decb69d411c",
        "prodType":1001,
        "envType":1,
        "updatedDate":"2017-04-05T03:36:10.462Z",
        "createdDate":"2017-04-05T03:36:10.462Z",
        "fileSize":33030328,
        "platform":1,
        "buildVersion":"2017032102",
        "displayName":"Ttel",
        "version":"4.1.4",
        "appIdentifier":"cn.papa.xfbeta",
        "iconUrl":"https://172.16.88.126:8181/icon/9a344aeb-2057-4f78-9134-3decb69d411c.png",
        "downloadUrl":"itms-services://?action=download-manifest&url=https://172.16.88.126:8181/plist/9a344aeb-2057-4f78-9134-3decb69d411c"
    }
}
```

## 查询所有产品最新的版本
**GET:**  apiv1/app/listAllProds

**Request:**

| 请求	| 必填 | 参数	| [类型]/限制	| 示例	|
|-----|----|---|--------|----|
1 | 必填 | platform | [int] | 无 |
1 | 必填 | pageNo | [int] | 无 |
1 | 选填 | pageSize | [int] | 无 |

```
{"pageNo":"1","pageSize":"15","platform":"1"}
```

**Response:**	

```json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "itemId": "297a22b6-2caa-4c1f-acce-bd35e95aff91",
      "prodType": 1031,
      "envType": 3,
      "platform": 1,
      "fileSize": "16499950",
      "buildVersion": "201700612.01",
      "displayName": "Ttel",
      "version": "1.2",
      "updatedDate": "2017-06-12T03:45:57.000Z",
      "createdDate": "2017-06-12T03:45:57.000Z",
      "appIdentifier": "cn.papa.ttel",
      "changeLog": "",
      "iconUrl": "https://172.16.88.230:8874/icon/297a22b6-2caa-4c1f-acce-bd35e95aff91.png",
      "downloadUrl": "itms-services://?action=download-manifest&url=https://172.16.88.230:8874/plist/297a22b6-2caa-4c1f-acce-bd35e95aff91"
    },
    {
      "itemId": "1c2f477f-c266-46c9-8752-ab9f87a5cddc",
      "prodType": 1001,
      "envType": 1,
      "platform": 1,
      "fileSize": "30231810",
      "buildVersion": "20170610.02",
      "displayName": "通 ",
      "version": "5.1.0",
      "updatedDate": "2017-06-10T09:59:03.000Z",
      "createdDate": "2017-06-10T09:59:03.000Z",
      "appIdentifier": "com.ppjs.ddtbeta",
      "changeLog": "",
      "iconUrl": "https://172.16.88.230:8874/icon/1c2f477f-c266-46c9-8752-ab9f87a5cddc.png",
      "downloadUrl": "itms-services://?action=download-manifest&url=https://172.16.88.230:8874/plist/1c2f477f-c266-46c9-8752-ab9f87a5cddc"
    }
  ]
}
```

## 查询指定产品
**GET:** apiv1/app/listSpecificProd

**Request:**

| 请求	| 必填 | 参数	| [类型]/限制	| 示例	|
|-----|----|---|--------|----|
1 | 必填 | prodType | [int]| 无 |
2 | 必填 | pageNo | [int] | 无 |
3 | 非必填 | pageSize | [int] | 无
4 | 必填 | envType | [int]| 无
5 | 必填 |platform |[int] |无

```
{"envType":"3","pageNo":"1","pageSize":"100","platform":"1","prodType":"1031"}
```

**Response:**

```json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "itemId": "297a22b6-2caa-4c1f-acce-bd35e95aff91",
      "prodType": 1031,
      "envType": 3,
      "platform": 1,
      "fileSize": "16499950",
      "buildVersion": "201700612.01",
      "displayName": "Ttel",
      "version": "1.2",
      "updatedDate": "2017-06-12T03:45:57.000Z",
      "createdDate": "2017-06-12T03:45:57.000Z",
      "appIdentifier": "cn.papa.ttel",
      "changeLog": "",
      "iconUrl": "https://172.16.88.230:8874/icon/297a22b6-2caa-4c1f-acce-bd35e95aff91.png",
      "downloadUrl": "itms-services://?action=download-manifest&url=https://172.16.88.230:8874/plist/297a22b6-2caa-4c1f-acce-bd35e95aff91"
    }
  ]
}
```

## 发送app到QA邮箱
**POST:** apiv1/app/emailqa

| 请求	| 必填 | 参数	| [类型]/限制	| 示例
|-----|----|---|--------|----|
1|  必填 | itemIds:  要发送的app ids| [array]| 无
2 | 必填 | receivers 接收的Email地址 | [array]| 无
3 | 非必填| from 谁发送的 | [text]| 无
4 |  非必填| subject| 邮件主题| [text]| 无
5 | 非必填| remark 备注信息| [text]| 无

**Request:**

```
{
"itemIds":["297a22b6-2caa-4c1f-acce-bd35e95aff91"],
"receivers":["whailong2010@gmail.com"]
}
```

Response:

```json
{
  "code": 1,
  "msg": "success",
  "data": {
    "note": "发送成功"
  }
}
```
## 删除指定的APP条目

**DELETE:** apiv1/app/delete

| 请求	| 必填 | 参数	| [类型]/限制	| 示例
|-----|----|---|--------|----|
1|  必填 | itemId:  | [text]| 无

Response: 

```json
{
    "msg":"SUCCESS",
    "code":1,
    "data":null
}
```
## 取证书
**GET:**  /cer/pubCer/selfSigned_pubCA.cer

iOS系统需要安装证书才能正常安装APP, 使用Safari浏览器打开即可安装

