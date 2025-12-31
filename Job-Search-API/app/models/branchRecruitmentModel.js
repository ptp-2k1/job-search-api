const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");

module.exports = function() {
    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Id, Name FROM [BranchRecruitment], [Branch] WHERE PostId=@id AND " +
            "[BranchRecruitment].BranchId = [Branch].Id";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null)
                } else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(param, result) {
        const pool = await conn;
        let query = "INSERT INTO [BranchRecruitment] (PostId, BranchId) VALUES ";
        for(let i=0; i<param.branchList.length; i++) {
            if(i < param.branchList.length-1) {
                query = query + "(" + param.postId + ", " + param.branchList[i].value + "), ";
            } else {
                query = query + "(" + param.postId + ", " + param.branchList[i].value + ")";
            }
        }
        return await pool.request().query(query, function (err, data) {
            if (!err) {
                result(Status.Created, data, Message.Success, null);
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.update = async function(param, result) {
        const pool = await conn;
        const query = "DELETE FROM [BranchRecruitment] WHERE PostId = @id";
        return await pool.request().input("id", sql.Int, param.postId).query(query, async function(err) {
            if(!err) {
                const pool = await conn;
                let query = "INSERT INTO [BranchRecruitment] (PostId, BranchId) VALUES ";
                for(let i=0; i<param.branchList.length; i++) {
                    if(i < param.branchList.length-1) {
                        query = query + "(" + param.postId + ", " + param.branchList[i].value + "), ";
                    } else {
                        query = query + "(" + param.postId + ", " + param.branchList[i].value + ")";
                    }
                }
                return await pool.request().query(query, function (err, data) {
                    if (!err) {
                        result(Status.Ok, data, Message.Success, null);
                    } else {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }
}