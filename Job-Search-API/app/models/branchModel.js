const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAll = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Id, Name, CreateDate FROM [Branch] ORDER BY Name";
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

    this.filter = async function(param, result) {
        const dateFilter = param.fromDate !== "" && param.toDate !== "" ? " AND CreateDate >= '" + param.fromDate + "' AND CreateDate <= '" + param.toDate + "'" : ""
        const pool = await conn;
        const query = "SELECT Id, Name, CreateDate FROM [Branch] WHERE Name LIKE N'%" + param.info +
            "%'"  + dateFilter + " ORDER BY Name";
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

    this.checkDuplicateName = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [Branch] WHERE Name=@name AND Id = @id) SELECT 1 AS Result " +
            "ELSE IF EXISTS(SELECT * FROM [Branch] WHERE Name=@name) SELECT 0 AS Result ELSE SELECT 1" +
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
        const query = "INSERT INTO [Branch] (Name, CreateDate, UserId) VALUES (@name, CURRENT_TIMESTAMP, @userId)";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
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
        const query = "SELECT Name FROM [Branch] WHERE Id = @id";
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

    this.update = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [Branch] SET Name=@name WHERE Id=@id";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.checkDelete = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [JobProfile] WHERE BranchId=@id) SELECT 1 AS Result " +
            "ELSE IF EXISTS(SELECT * FROM [BranchRecruitment] WHERE BranchId=@id) SELECT 1 AS Result " +
            "ELSE SELECT 0 AS Result";
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

    this.delete = async function(param, result) {
        const pool = await conn;
        const query = "DELETE FROM [Branch] WHERE Id = @id";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                result(Status.Ok, data, Message.Success, null);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }
}