/**
 * Created by PandaApe on 07/05/2017.
 * Email: whailong2010@gmail.com
 */


const dbHelper = require('./../db/dbHelper');


module.exports = {

    async listAllProds(platform, pageNo, pageSize){

        return await dbHelper.query(
            'SELECT * FROM app_info WHERE updatedDate in (SELECT MAX(updatedDate) FROM app_info i WHERE i.platform = ?  group by prodType) group by prodType order by updatedDate desc limit ?, ?',
            [platform, (pageNo - 1) * pageSize, pageSize]);
    },

    async listSpecificProd(prodType, envType, platform, pageNo, pageSize){

        return await  dbHelper.query(
            "select * from app_info where prodType = ? and envType = ? and platform = ?  order by updatedDate desc limit ?, ?",
            [prodType, envType, platform, (pageNo - 1) * pageSize, pageSize]);

    },

    async listProdArchivePackage(prodType, platform, pageNo, pageSize){

        return await  dbHelper.query(
            "SELECT * FROM app_info WHERE updatedDate in (SELECT MAX(updatedDate) " +
            "FROM app_info i WHERE i.platform = ? and i.prodType = ? group by i.version, i.envType)" +
            " ORDER BY version DESC, envType ASC limit ?, ?",
            [ platform, prodType, (pageNo - 1) * pageSize, pageSize]
        );

    },

    async insertAppInfoToDB(itemInfo) {

        return await  dbHelper.query(
            "INSERT INTO  app_info " +
            "(itemId, prodType, envType, fileSize, platform, buildVersion, displayName, version, appIdentifier, changeLog, updatedDate, createdDate) VALUES" +
            " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [itemInfo.itemId, itemInfo.prodType, itemInfo.envType, itemInfo.fileSize, itemInfo.platform,
                itemInfo.buildVersion, itemInfo.displayName, itemInfo.version, itemInfo.appIdentifier, itemInfo.changeLog,
                itemInfo.updatedDate, itemInfo.createdDate]
        );
    },

    async deleteApp(itemId){

        return await dbHelper.query("delete from app_info where itemId = ? ", [itemId]);
    },

    async retrieveApps(itemId){

        var itemIds;

        if (itemId instanceof Array) {

            itemIds = itemId;
        } else {

            itemIds = [itemId];
        }

        var sql = "select * from app_info where itemId in (";

        for (var i = 0; i < itemIds.length; i++) {

            if (i !== 0) {

                sql = sql + ",";
            }

            sql = sql + "?";
        }

        sql = sql + ");";

        return await  dbHelper.query(sql, itemIds);

    }

};
