const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")
const alfrescoApi = require('alfresco-js-api-node');
const fs = require("fs");

module.exports = function() {
    this.adminFilter = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT [PurchasedPackage].Id, Name, PurchasedDate, StartDate, " +
            "ExpiredDate, LastName + ' ' + FirstName AS Recruiter, Image FROM " +
            "[PurchasedPackage], [Package], [User] WHERE [PurchasedPackage].PackageId " +
            "= [Package].Id AND [PurchasedPackage].UserId = [User].Id AND " +
            "LastName + ' ' + FirstName LIKE N'%" + param.info + "%' AND " +
            "[PurchasedPackage].Status" + status + " ORDER BY PurchasedDate DESC";
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
        const query = "SELECT UseDayAmount FROM [Package], [PurchasedPackage] WHERE " +
            "[PurchasedPackage].Id = @id AND [PurchasedPackage].PackageId = [Package].Id";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .query(query, async function(err, data) {
                if(!err) {
                    if(data.recordset !== undefined) {
                        const pool = await conn;
                        let startDate = new Date();
                        let expiredDate = new Date();
                        startDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
                        expiredDate.setDate(expiredDate.getDate() + data.recordset[0].UseDayAmount)
                        expiredDate = expiredDate.getFullYear() + "-" + (expiredDate.getMonth() + 1) + "-" + expiredDate.getDate();
                        const query = "UPDATE [PurchasedPackage] SET Status=@status, " +
                            "StartDate=@startDate, ExpiredDate=@expiredDate WHERE Id=@id";
                        return await pool.request()
                            .input("status", sql.Bit, param.status)
                            .input("startDate", sql.Date, startDate)
                            .input("expiredDate", sql.Date, expiredDate)
                            .input("id", sql.Int, param.id)
                            .query(query, function (err, data) {
                                if (!err) {
                                    result(Status.Ok, data, Message.Success, null);
                                } else {
                                    result(Status.InternalServerError, null, Message.Error, err);
                                }
                            });
                    } else {
                            result(Status.InternalServerError, null, Message.Error, err);
                        }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT LastName, FirstName, PhoneNumber, Email, Name, PurchasePostBudget, " +
            "ProfileSearchAmount, PostShowDayAmount, UseDayAmount, PurchasedDate, StartDate, " +
            "ExpiredDate, [PurchasedPackage].Status FROM [User], [Package], [PurchasedPackage] WHERE " +
            "[PurchasedPackage].Id = @id AND [PurchasedPackage].UserId = [User].Id AND " +
            "[PurchasedPackage].PackageId = [Package].Id";
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

    this.recruiterFilter = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT [PurchasedPackage].Id, Name, PurchasePostBudget, PurchasedDate, StartDate, " +
            "ExpiredDate, [PurchasedPackage].Status FROM [PurchasedPackage], [Package] WHERE " +
            "[PurchasedPackage].PackageId = [Package].Id AND [PurchasedPackage].UserId = @id AND " +
            "Name LIKE N'%" + param.info + "%' AND [PurchasedPackage].Status" + status +
            " ORDER BY PurchasedDate DESC";
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.create = async function(param, result) {
        const date = new Date()
        const prefix = date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds()
        fs.writeFile(prefix + ".png", param.file, "base64", function(data, err) {
            if(err) {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
        const uploadFile = fs.createReadStream('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png");
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.upload.uploadFile(uploadFile, 'Sites/test-site/documentLibrary')
                .then(async function (file) {
                    const pool = await conn;
                    let query = "INSERT INTO [PurchasedPackage] (PackageId, UserId, PurchasedDate, Image, Status) VALUES ";
                    for(let i=0; i<param.amount; i++) {
                        if(i < param.amount-1) {
                            query = query + "(" + param.packageId + ", " + param.id + ", CURRENT_TIMESTAMP, '" + file.entry.id + "', 0), ";
                        } else {
                            query = query + "(" + param.packageId + ", " + param.id + ", CURRENT_TIMESTAMP, '" + file.entry.id + "', 0)";
                        }
                    }
                    return await pool.request().query(query, function(err, data) {
                        if(!err) {
                            result(Status.Created, data, Message.Success, null);
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
        }, function(err) {
            result(Status.InternalServerError, null, Message.Error, err);
            fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                console.log(err)
            })
        });
    }

    this.getProfileSearchAmount = async function(param, result) {
        const pool = await conn;
        const query = "SELECT SUM(ProfileSearchAmount) AS Total FROM [Package], [PurchasedPackage] " +
            "WHERE [PurchasedPackage].UserId = @id AND [PurchasedPackage].PackageId = [Package].Id " +
            "AND ExpiredDate > GETDATE() AND [PurchasedPackage].Status = 1";
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

    this.getAvailable = async function(param, result) {
        const pool = await conn;
        const query = "(SELECT [PurchasedPackage].Id, Name, PurchasePostBudget, " +
            "PostShowDayAmount, [Package].PurchasePostBudget - SUM(CASE WHEN " +
            "[PurchasedPackage].Id = [PostPackages].PurchasedPackageId THEN " +
            "HotWeight * 1000000 ELSE 0 END) " +
            "AS Remain, [PurchasedPackage].ExpiredDate FROM [PurchasedPackage], " +
            "[Package], [PostPackages] WHERE [PurchasedPackage].PackageId = [Package].Id " +
            "AND [PurchasedPackage].UserId = @id AND [PurchasedPackage].Status = 1 AND " +
            "([PurchasedPackage].Id = [PostPackages].PurchasedPackageId OR " +
            "[PurchasedPackage].Id IS NOT NULL) AND [PurchasedPackage].ExpiredDate > " +
            "GETDATE() GROUP BY [PurchasedPackage].Id, Name, PurchasePostBudget, " +
            "PostShowDayAmount, [PurchasedPackage].ExpiredDate)";
        return await pool.request().input("id", sql.Int, param.id).query(query, function(err, data) {
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

    this.getDetailImage = async function(param, result) {
        let alfrescoJsApi = new alfrescoApi();
        alfrescoJsApi.login('admin', '139').then(function () {
            alfrescoJsApi.nodes.getNodeInfo(param.id).then(function (file) {
                const name = file.name
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
}