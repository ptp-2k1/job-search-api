const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");
const alfrescoApi = require('alfresco-js-api-node');
const fs = require("fs");

module.exports = function() {
    this.getLatest = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 1 [File], Name FROM [CandidateCv] WHERE UserId=@id ORDER BY UploadDate DESC";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let alfrescoJsApi = new alfrescoApi();
                    alfrescoJsApi.login('admin', '139').then(function () {
                        alfrescoJsApi.core.nodesApi.getFileContent(data.recordset[0].File).then(function(file) {
                            const content = Buffer.from(file).toString("base64")
                            result(Status.Ok, {
                                Name: data.recordset[0].Name,
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

    this.filter = async function(param, result) {
        const pool = await conn;
        const query = "SELECT * FROM [CandidateCv] WHERE UserId=@id AND Name " +
            "LIKE N'%" + param.info + "%' ORDER BY UploadDate DESC, Name ASC";
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

    this.getContent = async function(param, result) {
        const alfrescoJsApi = new alfrescoApi()
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.core.nodesApi.getFileContent(param).then(function(file) {
                const content = Buffer.from(file).toString("base64")
                result(Status.Ok, {
                    File: content
                }, Message.Success, null);
            }, function(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            });
        }, function (err) {
            result(Status.InternalServerError, null, Message.Error, err);
        });
    }

    this.create = async function(param, result) {
        fs.writeFile(param.userId + param.name, param.file, "base64", function(data, err) {
            if(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
        const file = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.name);
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.upload.uploadFile(file, 'Sites/test-site/documentLibrary')
                .then(async function (file) {
                    const pool = await conn;
                    const query = "INSERT INTO [CandidateCv] ([File], Name, UploadDate, UserId) " +
                        "VALUES (@file, @name, CURRENT_TIMESTAMP, @userId)";
                    return await pool.request()
                        .input("file", sql.VarChar, file.entry.id)
                        .input("name", sql.NVarChar, param.name)
                        .input("userId", sql.NVarChar, param.userId)
                        .query(query, function(err, data) {
                            if(!err) {
                                result(Status.Created, data, Message.Success, null);
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                            }
                            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName, (err) => {
                                console.log(err)
                            })
                        });
                }, function (err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName, (err) => {
                        console.log(err)
                    })
                });
        }, function(err) {
            result(Status.InternalServerError, null, Message.Error, err);
            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName, (err) => {
                console.log(err)
            })
        });
    }

    this.delete = async function(param, result) {
        const alfrescoJsApi = new alfrescoApi()
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.nodes.deleteNodePermanent(param).then(async function () {
                const pool = await conn;
                const query = "DELETE FROM [CandidateCv] WHERE [File] = @file";
                return await pool.request().input("file", sql.VarChar, param).query(query, function(err, data) {
                    if(!err) {
                        result(Status.Ok, data, Message.Success, null);
                    }else {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
            }, function (err) {
                result(Status.InternalServerError, null, Message.Error, err);
            });
        }, function (err) {
            result(Status.InternalServerError, null, Message.Error, err);
        });
    }

    this.checkDuplicateName = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [CandidateCv] WHERE Name=@name AND UserId = @userId) SELECT 1 AS Result " +
            "ELSE SELECT 0 AS Result";
        return await pool.request()
            .input("name", sql.NVarChar, param.name)
            .input("userId", sql.Int, param.id)
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
}