const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");

module.exports = function() {
    this.getRoles = async function(param, result) {
        const pool = await conn;
        const query = "SELECT PageLayoutId FROM [Authorization] WHERE UserId = @id";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.checkRoute = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS (SELECT * FROM [Authorization], [PageLayout] WHERE UserId = @id AND Route = @route " +
            "AND [Authorization].PageLayoutId = [PageLayout].Id) SELECT 1 AS Result ELSE SELECT 0 AS Result";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .input("route", sql.VarChar, param.route)
            .query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset[0], Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.assignRoles = async function(param, result) {
        const pool = await conn;
        const query = "DELETE FROM [Authorization] WHERE UserId = @id";
        return await pool.request().input("id", sql.Int, param.id).query(query, async function(err) {
                if(!err) {
                    const pool = await conn;
                    let query = "INSERT INTO [Authorization] (UserId, PageLayoutId) VALUES ";
                    for(let i=0; i<param.roleList.length; i++) {
                        if(i < param.roleList.length-1) {
                            query = query + "(" + param.id + ", " + param.roleList[i] + "), ";
                        } else {
                            query = query + "(" + param.id + ", " + param.roleList[i] + ")";
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