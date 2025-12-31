const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");
const alfrescoApi = require('alfresco-js-api-node');
const fs = require("fs");

module.exports = function() {
    this.getAll = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Id, Cover, Logo, Name, Description FROM [Company] WHERE Status = 1 AND Name LIKE N'%" + param.info + "%'";
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

    this.getAdminDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT [Company].*, LastName + ' ' + FirstName As Recruiter FROM [Company], [User] " +
            "WHERE [Company].Id = @id AND [Company].UserId = [User].Id";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset[0], Message.Success, null);
                } else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getRecruiterDetail = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [Company] WHERE UserId=@id) SELECT * FROM [Company] " +
            "WHERE UserId=@id ELSE SELECT 1 AS Result";
        return await pool.request()
            .input("id", sql.Int, body.id)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset !== undefined) {
                        result(Status.Ok, data.recordset[0], Message.Success, null);
                    }else {
                        result(Status.Ok, null, Message.Success, null);
                    }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getDetailFile = async function(param, result) {
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.nodes.getNodeInfo(param.id).then(function (file) {
                const name = file.name.replace(param.userId, "");
                alfrescoJsApi.core.nodesApi.getFileContent(param.id).then(function(file) {
                    const content = Buffer.from(file).toString("base64")
                    result(Status.Ok, {
                        Name: name,
                        File: content
                    }, Message.Success, null);
                }, function(err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                });
            }, function (err) {
                result(Status.InternalServerError, null, Message.Error, err);
            });
        }, function (err) {
            result(Status.InternalServerError, null, Message.Error, err);
        });
    }

    this.filter = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT Id, Name, Status FROM [Company] WHERE Name LIKE N'%" + param.info + "%'" +
            " AND Status" + status;
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
        const query = "UPDATE [Company] SET Status=@status WHERE Id=@id";
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

    this.create = async function(param, result) {
        fs.writeFile(param.userId + param.fileName, param.file, "base64", function(data, err) {
            if(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
        const file = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName);
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.upload.uploadFile(file, 'Sites/test-site/documentLibrary')
                .then(async function (file) {
                    const pool = await conn;
                    const query = "INSERT INTO [Company] (Name, Address, Nation, Field, Email, " +
                        "Description, EmployeeAmount, Logo, Cover, Website, [File], Status, UserId) " +
                        "VALUES (@name, @address, @nation, @field, @email, @description, " +
                        "@employeeAmount, @logo, @cover, @website, @file, @status, @userId)";
                    return await pool.request()
                        .input("logo", sql.VarChar, param.logo)
                        .input("cover", sql.VarChar, param.cover)
                        .input("name", sql.NVarChar, param.name)
                        .input("address", sql.NVarChar, param.address)
                        .input("nation", sql.NVarChar, param.nation)
                        .input("field", sql.NVarChar, param.field)
                        .input("email", sql.VarChar, param.email)
                        .input("employeeAmount", sql.Int, param.employeeAmount)
                        .input("website", sql.VarChar, param.website)
                        .input("file", sql.VarChar, file.entry.id)
                        .input("description", sql.NVarChar, param.description)
                        .input("status", sql.Bit, 0)
                        .input("userId", sql.Int, param.userId)
                        .query(query, function(err, data) {
                            if(!err) {
                                result(Status.Created, data, Message.Success, null);
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                                console.log(err)
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

    this.update = async function(param, result) {
        const alfrescoJsApi = new alfrescoApi()
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.nodes.deleteNodePermanent(param.oldFile).then(async function () {
                fs.writeFile(param.userId + param.fileName, param.file, "base64", function(data, err) {
                    if(err) {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
                const file = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName);
                alfrescoJsApi.login('admin', '139').then(function () {
                    alfrescoJsApi.upload.uploadFile(file, 'Sites/test-site/documentLibrary')
                        .then(async function (file) {
                            const pool = await conn;
                            const query = "UPDATE [Company] SET Name=@name, Address=@address, " +
                                "Nation=@nation, Field=@field, Email=@email, Description=@description, " +
                                "employeeAmount=@employeeAmount, Cover=@cover, Logo=@logo, " +
                                "Website=@website, [File]=@file WHERE Id=@id";
                            return await pool.request()
                                .input("logo", sql.VarChar, param.logo)
                                .input("cover", sql.VarChar, param.cover)
                                .input("name", sql.NVarChar, param.name)
                                .input("address", sql.NVarChar, param.address)
                                .input("nation", sql.NVarChar, param.nation)
                                .input("field", sql.NVarChar, param.field)
                                .input("email", sql.VarChar, param.email)
                                .input("employeeAmount", sql.Int, param.employeeAmount)
                                .input("website", sql.VarChar, param.website)
                                .input("file", sql.VarChar, file.entry.id)
                                .input("description", sql.NVarChar, param.description)
                                .input("id", sql.Int, param.id)
                                .query(query, function(err, data) {
                                    if(!err) {
                                        result(Status.Ok, data, Message.Success, null);
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
                }, function (err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + param.userId + param.fileName, (err) => {
                        console.log(err)
                    })
                });
            }, function (err) {
                result(Status.InternalServerError, null, Message.Error, err);
            });
        }, function (err) {
            result(Status.InternalServerError, null, Message.Error, err);
        });
    }

    this.checkStatus = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Status FROM [Company] WHERE UserId = @userId";
        return await pool.request()
            .input("userId", sql.Int, param.userId)
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

    this.createImage = async function(param, result) {
        const date = new Date()
        const prefix = date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds()
        fs.writeFile(prefix + ".png", param.file, "base64", function(data, err) {
            if(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
        const file = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png");
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.upload.uploadFile(file, 'Sites/test-site/documentLibrary')
                .then(async function (file) {
                    const pool = await conn;
                    const type = param.type === "cover" ? "Cover = '" + file.entry.id + "'" : "Logo = '" + file.entry.id + "'"
                    const query = "UPDATE [Company] SET " + type + " WHERE Id=@id";
                    return await pool.request()
                        .input("id", sql.Int, param.id)
                        .query(query, function(err, data) {
                            if(!err) {
                                result(Status.Created, data, Message.Success, null);
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                                console.log(err)
                            }
                            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                                console.log(err)
                            })
                        });
                }, function (err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                        console.log(err)
                    })
                });
        }, function(err) {
            result(Status.InternalServerError, null, Message.Error, err);fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                console.log(err)
            })
        });
    }

    this.updateImage = async function(param, result) {
        const date = new Date()
        const prefix = date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds()
        const alfrescoJsApi = new alfrescoApi()
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.nodes.deleteNodePermanent(param.oldFile).then(async function () {
                fs.writeFile(prefix + ".png", param.file, "base64", function(data, err) {
                    if(err) {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
                const file = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png");
                alfrescoJsApi.login('admin', '139').then(function () {
                    alfrescoJsApi.upload.uploadFile(file, 'Sites/test-site/documentLibrary')
                        .then(async function (file) {
                            const pool = await conn;
                            const type = param.type === "cover" ? "Cover = '" + file.entry.id + "'" : "Logo = '" + file.entry.id + "'"
                            const query = "UPDATE [Company] SET " + type + " WHERE Id=@id";
                            return await pool.request()
                                .input("id", sql.Int, param.id)
                                .query(query, function(err, data) {
                                    if(!err) {
                                        result(Status.Ok, data, Message.Success, null);
                                    }else {
                                        result(Status.InternalServerError, null, Message.Error, err);
                                    }
                                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                                        console.log(err)
                                    })
                                });
                        }, function (err) {
                            result(Status.InternalServerError, null, Message.Error, err);
                            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                                console.log(err)
                            })
                        });
                }, function (err) {
                    result(Status.InternalServerError, null, Message.Error, err);
                    fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                        console.log(err)
                    })
                });
            }, function (err) {
                result(Status.InternalServerError, null, Message.Error, err);
            });
        }, function (err) {
            result(Status.InternalServerError, null, Message.Error, err);
        });
    }

    this.getImage = async function(param, result) {
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.core.nodesApi.getFileContent(param.id).then(function(file) {
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
}