const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.filter = async function(param, result) {
        const all = " IS NOT NULL ";
        const dateFilter = param.fromDate !== "" && param.toDate !== "" ? " AND CreateDate >= '" + param.fromDate + "' AND CreateDate <= '" + param.toDate + "'" : ""
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT Id, Name, CreateDate, Status FROM [Package] WHERE Name LIKE N'%" +
            param.info + "%'" + dateFilter + " AND Status" + status + " ORDER BY Name";
        return await pool.request().query(query, function(err, data) {
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

    this.getAll = async function(param, result) {
        const pool = await conn;
        const query = "SELECT * FROM [Package] WHERE Status = 1 ORDER BY PurchasePostBudget";
        return await pool.request().query(query, function(err, data) {
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

    this.changeStatus = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [Package] SET Status=@status WHERE Id=@id";
        return await pool.request()
            .input("status", sql.Bit, param.status)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.checkDuplicateName = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [Package] WHERE Name=@name AND Id = @id) SELECT 1 AS Result " +
            "ELSE IF EXISTS(SELECT * FROM [Package] WHERE Name=@name) SELECT 0 AS Result ELSE SELECT 1" +
            "AS Result";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
            .input("id", sql.Int, param.id)
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

    this.create = async function(param, result) {
        const pool = await conn;
        const query = "INSERT INTO [Package] (Name, PurchasePostBudget, " +
            "ProfileSearchAmount, PostShowDayAmount, UseDayAmount, Status, CreateDate, " +
            "UserId) VALUES (@name, @purchasePostBudget, @profileSearchAmount, " +
            "@postShowDayAmount, @useDayAmount, @status, CURRENT_TIMESTAMP, @userId)";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
            .input("purchasePostBudget", sql.Money, param.purchasePostBudget)
            .input("profileSearchAmount", sql.Int, param.profileSearchAmount)
            .input("postShowDayAmount", sql.Int, param.postShowDayAmount)
            .input("useDayAmount", sql.Int, param.useDayAmount)
            .input("status", sql.Bit, 1)
            .input("userId", sql.Int, param.userId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Name, PurchasePostBudget, ProfileSearchAmount, " +
            "PostShowDayAmount, UseDayAmount FROM [Package] WHERE Id = @id";
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.checkAppliedPackage = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [PurchasedPackage] WHERE PackageId=@id) " +
            "SELECT 1 AS Result ELSE SELECT 0 AS Result";
        return await pool.request()
            .input("id", sql.Int, param.id)
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

    this.update = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [Package] SET Name=@name, " +
            "PurchasePostBudget=@purchasePostBudget, " +
            "ProfileSearchAmount=@profileSearchAmount, " +
            "PostShowDayAmount=@postShowDayAmount, " +
            "UseDayAmount=@useDayAmount WHERE Id=@id";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
            .input("purchasePostBudget", sql.Money, param.purchasePostBudget)
            .input("profileSearchAmount", sql.Int, param.profileSearchAmount)
            .input("postShowDayAmount", sql.Int, param.postShowDayAmount)
            .input("useDayAmount", sql.Int, param.useDayAmount)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.delete = async function(param, result) {
        const pool = await conn;
        const query = "DELETE FROM [Package] WHERE Id = @id";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                result(Status.Ok, data, Message.Success, null);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }
}