const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.create = async function(param, result) {
        const pool = await conn;
        const hotWeight = param.hotWeight / 1000000;
        const dayAmount = Math.ceil(param.hotWeight / (param.purchasePostBudget / param.postShowDayAmount))
        let expiredDate = param.expiredDate ? new Date(Number(param.expiredDate.split("-")[0]), Number(param.expiredDate.split("-")[1])-1, Number(param.expiredDate.split("-")[2])+1) : new Date();
        expiredDate.setDate(expiredDate.getDate() + dayAmount)
        expiredDate = expiredDate.getFullYear() + "-" + (expiredDate.getMonth() + 1) + "-" + expiredDate.getDate();
        const query = "INSERT INTO [PostPackages] (PostId, PurchasedPackageId, HotWeight, " +
            "StartDate, ExpiredDate) VALUES (@postId, @purchasedPackageId, @hotWeight, " +
            "CURRENT_TIMESTAMP, @expiredDate)";
        return await pool.request()
            .input("postId", sql.Int, param.postId)
            .input("purchasedPackageId", sql.Int, param.purchasedPackageId)
            .input("hotWeight", sql.Float, hotWeight)
            .input("expiredDate", sql.Date, expiredDate)
            .query(query, function (err, data) {
                if (!err) {
                    result(Status.Created, data, Message.Success, null);
                } else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
        });
    }
}