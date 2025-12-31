const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");
const alfrescoApi = require('alfresco-js-api-node');
const fs = require("fs");

module.exports = function() {
    this.getCandidate = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT Title, [ApplyJobs].UserId, PostId, IsChecked, ApplyDate FROM [ApplyJobs], [Post] " +
            "WHERE [ApplyJobs].UserId=@id AND [ApplyJobs].PostId = [Post].Id AND IsChecked" + status +
            " ORDER BY ApplyDate DESC";
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.search = async function(param, result) {
        const pool = await conn;
        const query = "SELECT * FROM [CandidateCv] WHERE Name LIKE N'%" + param + "%'";
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

    this.getCandidateDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT [File], SelfIntroduction FROM [ApplyJobs] WHERE UserId=@userId AND PostId=@postId";
        return await pool.request()
            .input("userId", sql.Int, param.userId)
            .input("postId", sql.Int, param.postId)
            .query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let alfrescoJsApi = new alfrescoApi();
                    alfrescoJsApi.login('admin', '139').then(function () {
                        alfrescoJsApi.core.nodesApi.getFileContent(data.recordset[0].File).then(function(file) {
                            const content = Buffer.from(file).toString("base64")
                            result(Status.Ok, {
                                SelfIntroduction: data.recordset[0].SelfIntroduction,
                                File: content
                            }, Message.Success, null);
                        }, function(err) {
                            result(Status.InternalServerError, null, Message.Error, err);
                        });
                    }, function (err) {
                        result(Status.InternalServerError, null, Message.Error, err);
                    });
                } else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.checkDuplicate = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS (SELECT * FROM [ApplyJobs] WHERE UserId=@userId AND PostId=@postId) " +
            "SELECT 1 AS Result ELSE SELECT 0 AS Result";
        return await pool.request()
            .input("userId", sql.Int, param.userId)
            .input("postId", sql.Int, param.postId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data.recordset[0], Message.Success, null);
                } else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.create = async function(param, result) {
        const date = new Date()
        const prefix = date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds()
        fs.writeFile(prefix + ".pdf", param.file, "base64", function(data, err) {
            if(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
        const uploadFile = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".pdf");
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.upload.uploadFile(uploadFile, 'Sites/test-site/documentLibrary')
                .then(async function (file) {
                    const pool = await conn;
                    const query = "INSERT INTO [ApplyJobs] (UserId, PostId, [File], SelfIntroduction, " +
                        "IsChecked, ApplyDate) VALUES (@userId, @postId, @file, @selfIntroduction, @isChecked, " +
                        "CURRENT_TIMESTAMP)";
                    return await pool.request()
                        .input("userId", sql.Int, param.userId)
                        .input("postId", sql.Int, param.postId)
                        .input("file", sql.VarChar, file.entry.id)
                        .input("selfIntroduction", sql.NVarChar, param.selfIntroduction)
                        .input("isChecked", sql.Bit, 0)
                        .query(query, function(err, data) {
                            if(!err) {
                                result(Status.Created, data, Message.Success, null);
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                            }
                            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".pdf", (err) => {
                                console.log(err)
                            })
                        });
                }, function (err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".pdf", (err) => {
                        console.log(err)
                    })
                });
        }, function(err) {
            result(Status.InternalServerError, null, Message.Error, err);
            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".pdf", (err) => {
                console.log(err)
            })
        });
    }

    this.getLatestApplication = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 10 [User].Id AS UserId, [Post].Id AS PostId, Title, " +
            "LastName + ' ' + FirstName AS FullName, Gender, Email, PhoneNumber, ApplyDate, " +
            "IsChecked FROM [ApplyJobs], [User], [Post] WHERE [ApplyJobs].UserId= [User].Id " +
            "AND [ApplyJobs].PostId = [Post].Id AND [Post].UserId = @id ORDER BY ApplyDate " +
            "DESC";
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.getPostApplication = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const fromDate = param.fromDate !== null ? " >='" +  param.fromDate.toString() + "' ": all;
        const toDate =  param.toDate !== null ? " <='" +  param.toDate.toString() + "' ": all;
        const pool = await conn;
        const query = "SELECT [User].Id AS UserId, [Post].Id AS PostId, LastName + ' ' + " +
            "FirstName AS FullName, Gender, Email, PhoneNumber, ApplyDate, IsChecked FROM " +
            "[ApplyJobs], [User], [Post] WHERE [ApplyJobs].UserId= [User].Id AND " +
            "[ApplyJobs].PostId = [Post].Id AND [Post].Id = @id AND IsChecked" + status +
            "AND ApplyDate" + fromDate + " AND ApplyDate" + toDate +
            "ORDER BY ApplyDate " + param.order;
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.changeStatus = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [ApplyJobs] SET IsChecked=@isChecked WHERE UserId=@userId AND " +
            "PostId = @postId";
        return await pool.request()
            .input("isChecked", sql.Bit, param.isChecked)
            .input("userId", sql.Int, param.userId)
            .input("postId", sql.Int, param.postId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }
}