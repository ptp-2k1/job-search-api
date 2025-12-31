const { conn, sql } = require("../../config/databaseConnection");
const { Status } = require("../../enums/Status");
const { Message } = require("../../enums/Message");
const bcrypt = require("bcrypt");
const saltRounds = 10
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const alfrescoApi = require('alfresco-js-api-node');
const fs = require("fs");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'n19dccn139@student.ptithcm.edu.vn',
        pass: 'twiceblackpink'
    }
});

const mail = {
    from: "n19dccn139@student.ptithcm.edu.vn",
    to: "",
    subject: "Hồi phục mật khẩu cho tài khoản của bạn",
    text: ""
};

module.exports = function() {
    this.verifyToken = async function(param, result) {
        result(Status.Ok, null, Message.Success, null);
    }

    this.login = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [User] WHERE Account = @account) SELECT Id, Password, " +
            "RoleId, Status FROM [User] WHERE Account = @account";
        return await pool.request()
            .input("account", sql.VarChar, param.account)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset !== undefined) {
                        bcrypt.compare(param.password, data.recordset[0].Password, function(err, res){
                            if(err){
                                result(Status.InternalServerError, null, Message.Error, err);
                            }else {
                                if(res) {
                                    if(data.recordset[0].Status) {
                                        const user = { account: param.account }
                                        const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN)
                                        result(Status.Ok, {
                                            id: data.recordset[0].Id,
                                            role: data.recordset[0].RoleId,
                                            token: accessToken
                                        }, Message.Success, err);
                                    }else {
                                        result(Status.Forbidden, null, Message.Forbidden, err);
                                    }
                                }else {
                                    result(Status.Unauthorized, {
                                        category: "password"
                                    }, Message.Unauthorized, null);
                                }
                            }
                        });
                    }else {
                        result(Status.Unauthorized, {
                            category: "account"
                        }, Message.Unauthorized, null);
                    }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.checkDuplicateAccount = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [User] WHERE Account=@account) SELECT 0 AS Result " +
            "ELSE SELECT 1 AS Result";
        return await pool.request()
            .input("account", sql.VarChar, param.account)
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

    this.checkDuplicatePhoneNumber = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [User] WHERE PhoneNumber=@phoneNumber AND Id = @id) " +
            "SELECT 1 AS Result ELSE IF EXISTS(SELECT * FROM [User] WHERE PhoneNumber=@phoneNumber) " +
            "SELECT 0 AS Result ELSE SELECT 1 AS Result";
        return await pool.request()
            .input("phoneNumber", sql.VarChar, param.phoneNumber)
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

    this.checkDuplicateEmail = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [User] WHERE Email=@email AND Id = @id) SELECT 1 AS Result " +
            "ELSE IF EXISTS(SELECT * FROM [User] WHERE Email=@email) SELECT 0 AS Result ELSE SELECT 1 AS Result";
        return await pool.request()
            .input("email", sql.VarChar, param.email)
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
        bcrypt.hash(param.password, saltRounds).then(async hash => {
            const pool = await conn;
            const query = "INSERT INTO [User] (LastName, FirstName, Gender, PhoneNumber, Email, BirthDate, Address, " +
                "Avatar, Account, Password, RoleId, Status) VALUES (@lastName, @firstName, @gender, @phoneNumber, " +
                "@email, @birthDate, @address, @avatar, @account, @password, @roleId, @status)";
            return await pool.request()
                .input("lastName", sql.NVarChar, param.lastName)
                .input("firstName", sql.NVarChar, param.firstName)
                .input("gender", sql.Bit, param.gender)
                .input("phoneNumber", sql.VarChar, param.phoneNumber)
                .input("email", sql.VarChar, param.email)
                .input("birthDate", sql.Date, param.birthDate)
                .input("address", sql.NVarChar, param.address)
                .input("avatar", sql.VarChar, param.avatar)
                .input("account", sql.VarChar, param.account)
                .input("password", sql.VarChar, hash)
                .input("roleId", sql.Int, param.roleId)
                .input("status", sql.Bit, 1)
                .query(query, function(err, data) {
                    if(!err) {
                        result(Status.Created, data, Message.Success, null);
                    }else {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
        })
    }

    this.resetPassword = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS (SELECT * FROM [User] WHERE Email = @email) SELECT 1 AS Result ELSE SELECT 0 AS Result";
        return await pool.request()
            .input("email", sql.VarChar, param)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset[0].Result === 1) {
                        let rand = Math.floor(Math.random() * 1000000000000000);
                        let mailTo = param;
                        bcrypt.hash(rand.toString(), saltRounds).then(async hash => {
                            const pool = await conn;
                            const query = "UPDATE [User] SET Password = @password WHERE Email = @email";
                            return await pool.request()
                                .input("email", sql.VarChar, param)
                                .input("password", sql.VarChar, hash)
                                .query(query, function (err) {
                                    if (!err) {
                                        mail.to = mailTo;
                                        mail.text = "JobFinder xin chào ! Chúng tôi đã nhận được yêu cầu " +
                                            "được phục hồi mật khẩu của bạn. Vui lòng không chia sẻ mật khẩu đã " +
                                            "được phục hồi này cho ai khác và hãy dùng nó để đăng nhập lại vào " +
                                            "tài khoản của bạn trên hệ thống nhé. Mật khẩu mới của bạn là: " + rand;
                                        transporter.sendMail(mail, function (err, info) {
                                            if (!err) {
                                                result(Status.Ok, info, Message.Success, null);
                                            } else {
                                                result(Status.InternalServerError, null, Message.Error, err);
                                            }
                                        });
                                    } else {
                                        result(Status.InternalServerError, null, Message.Error, err);
                                    }
                                });
                        });
                    } else {
                        result(Status.Forbidden, null, Message.Forbidden, null);
                    }
                } else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.filterStaff = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Id, Account, LastName + ' ' + FirstName AS Name FROM [User] WHERE " +
            "LastName + ' ' + FirstName LIKE N'%" + param.info + "%' AND RoleId = 1 AND Id != @id";
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

    this.filterUser = async function(param, result) {
        const all = " IS NOT NULL ";
        const role = param.role !== 0 ? " = " + param.role.toString() : all;
        const pool = await conn;
        const query = "SELECT Id, LastName + ' ' + FirstName AS Name, Email, PhoneNumber, Status FROM " +
            "[User] WHERE LastName + ' ' + FirstName LIKE N'%" + param.info + "%' AND RoleId" + role +
            " AND Id != @id";
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

    this.changeStatus = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [User] SET Status=@status WHERE Id=@id";
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

    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Account, LastName, FirstName, Gender, PhoneNumber, Email, BirthDate, " +
            "Address, Avatar FROM [User] WHERE Id = @id";
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
        const query = "UPDATE [User] SET LastName=@lastName, FirstName=@firstName, Gender=@gender, " +
            "PhoneNumber=@phoneNumber, Email=@email, BirthDate=@birthDate, Address=@address, Avatar=@avatar " +
            "WHERE Id=@id";
        return await pool.request()
            .input("lastName", sql.NVarChar, param.lastName)
            .input("firstName", sql.NVarChar, param.firstName)
            .input("gender", sql.Bit, param.gender)
            .input("phoneNumber", sql.VarChar, param.phoneNumber)
            .input("email", sql.VarChar, param.email)
            .input("birthDate", sql.Date, param.birthDate)
            .input("address", sql.NVarChar, param.address)
            .input("avatar", sql.VarChar, param.avatar)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.checkPassword = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Password FROM [User] WHERE Id = @id";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        bcrypt.compare(param.password, data.recordset[0].Password, function(err, res){
                            if(!err) {
                                result(Status.Ok, res, Message.Success, null);
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                            }
                        });
                    }else {
                        result(Status.Ok, null, Message.Empty, null);
                    }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.changePassword = async function(param, result) {
        bcrypt.hash(param.password, saltRounds).then(async hash => {
            const pool = await conn;
            const query = "UPDATE [User] SET Password = @password WHERE Id = @id";
            return await pool.request()
                .input("password", sql.VarChar, hash)
                .input("id", sql.Int, param.id)
                .query(query, function(err, data) {
                    if(!err) {
                        result(Status.Ok, data, Message.Success, null);
                    }else {
                        result(Status.InternalServerError, null, Message.Error, err);
                    }
                });
        })
    }

    this.createAvatar = async function(param, result) {
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
                    const query = "UPDATE [User] SET Avatar=@avatar WHERE Id=@id";
                    return await pool.request()
                        .input("avatar", sql.VarChar, file.entry.id)
                        .input("id", sql.Int, param.id)
                        .query(query, function(err, data) {
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
            result(Status.InternalServerError, null, Message.Error, err);fs.unlink('D:\\coding\\javascript\\project\\Job-Search-API\\' + prefix + ".png", (err) => {
                console.log(err)
            })
        });
    }

    this.updateAvatar = async function(param, result) {
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
                            const query = "UPDATE [User] SET Avatar=@avatar WHERE Id=@id";
                            return await pool.request()
                                .input("avatar", sql.VarChar, file.entry.id)
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

    this.getAvatar = async function(param, result) {
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