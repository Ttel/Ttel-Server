/**
 * Created by PandaApe on 05/05/2017.
 * Email: whailong2010@gmail.com
 */

const fs = require('fs-extra');
const dbHelper = require('./../../app/db/dbHelper');

/**
 * 获取sql目录下的文件目录数据
 * @return {object}
 */
function getSqlMap() {

    let basePath = __dirname

    basePath = basePath.replace(/\\/g, '\/')

    let pathArr = basePath.split('\/')
    pathArr = pathArr.splice(0, pathArr.length - 1)
    basePath = pathArr.join('/') + '/init/sql/'


    let fileList = walkFile(basePath, 'sql')


    return fileList
}

/**
 * 遍历目录下的文件目录
 * @param  {string} pathResolve  需进行遍历的目录路径
 * @param  {string} mime         遍历文件的后缀名
 * @return {object}              返回遍历后的目录结果
 */
function walkFile(pathResolve, mime) {

    let files = fs.readdirSync(pathResolve)

    let fileList = {}

    for (let [i, item] of files.entries()) {
        let itemArr = item.split('\.')

        let itemMime = ( itemArr.length > 1 ) ? itemArr[itemArr.length - 1] : 'undefined'
        let keyName = item + ''
        if (mime === itemMime) {
            fileList[item] = pathResolve + item
        }
    }

    return fileList
}

/**
 * 读取sql文件内容
 * @param  {string} fileName 文件名称
 * @param  {string} path     文件所在的路径
 * @return {string}          脚本文件内容
 */
function getSqlContent(fileName, path, sqlContentMap) {
    let content = fs.readFileSync(path, 'binary')
    sqlContentMap[fileName] = content
}

/**
 * 封装所有sql文件脚本内容
 * @return {object}
 */
function getSqlContentMap() {

    var sqlContentMap = {};

    let sqlMap = getSqlMap()
    for (let key in sqlMap) {
        getSqlContent(key, sqlMap[key], sqlContentMap)
    }

    return sqlContentMap;
}

// 打印脚本执行日志
const eventLog = function (err, sqlFile, index) {
    if (err) {
        console.log(`[ERROR] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行失败 o(╯□╰)o ！`)
    } else {
        console.log(`[SUCCESS] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行成功 O(∩_∩)O !`)
    }
}

// 执行建表sql脚本
const createAllTables = async () => {

    var map = getSqlContentMap();
    for (let key in getSqlContentMap()) {

        let sqlShell = map[key]
        let sqlShellList = sqlShell.split(';')

        for (let [i, shell] of sqlShellList.entries()) {
            if (shell.trim()) {
                let result = await dbHelper.query(shell)
                if (result.serverStatus * 1 === 2) {
                    eventLog(null, key, i)
                } else {
                    eventLog(true, key, i)
                }
            }
        }
    }
    console.log('sql脚本执行结束！')
    console.log('请按 ctrl + c 键退出！')

}

createAllTables();