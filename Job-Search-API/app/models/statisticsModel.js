const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getCategoryData = async function(param, result) {
        const pool = await conn;
        let query = "SELECT (SELECT COUNT(*) FROM [User]) AS Users, (SELECT COUNT(*) " +
            "FROM [Package]) AS Packages, (SELECT COUNT(*) FROM [Company]) AS Companies, " +
            "(SELECT COUNT(*) FROM [Post]) AS Posts";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Ok, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getRevenueByYearTotal = async function(param, result) {
        const pool = await conn;
        const query = "EXEC REVENUE_BY_YEAR @year";
        return await pool.request()
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getPostsByYearTotal = async function(param, result) {
        const pool = await conn;
        const query = "EXEC POSTS_BY_YEAR_TOTAL @year";
        return await pool.request()
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getApplicationsByYearTotal = async function(param, result) {
        const pool = await conn;
        const query = "EXEC APPLICATIONS_BY_YEAR_TOTAL @year";
        return await pool.request()
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getTopRecruitmentBranch = async function(param, result) {
        const pool = await conn;
        const query = "EXEC TOP_HOT_BRANCH @fromDate, @toDate";
        return await pool.request()
            .input("fromDate", sql.Date, param.fromDate)
            .input("toDate", sql.Date, param.toDate)
            .query(query, function(err, data) {
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

    this.getTopRecruitmentCompany = async function(param, result) {
        const pool = await conn;
        let query = "EXEC TOP_RECRUITMENT_COMPANY @fromDate, @toDate";
        return await pool.request()
            .input("fromDate", sql.Date, param.fromDate)
            .input("toDate", sql.Date, param.toDate)
            .query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Ok, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getTopApplicationCompany = async function(param, result) {
        const pool = await conn;
        let query = "EXEC TOP_APPLICATION_COMPANY @fromDate, @toDate";
        return await pool.request()
            .input("fromDate", sql.Date, param.fromDate)
            .input("toDate", sql.Date, param.toDate)
            .query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Ok, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getTopPurchaseCompany = async function(param, result) {
        const pool = await conn;
        let query = "EXEC TOP_PURCHASE_COMPANY @fromDate, @toDate";
        return await pool.request()
            .input("fromDate", sql.Date, param.fromDate)
            .input("toDate", sql.Date, param.toDate)
            .query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Ok, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getTopPurchasedPackage = async function(param, result) {
        const pool = await conn;
        let query = "EXEC TOP_PURCHASED_PACKAGE @fromDate, @toDate";
        return await pool.request()
            .input("fromDate", sql.Date, param.fromDate)
            .input("toDate", sql.Date, param.toDate)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        result(Status.Ok, data.recordset, Message.Ok, null);
                    }else {
                        result(Status.Ok, null, Message.Empty, null);
                    }
                } else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getPaymentByCompany = async function(param, result) {
        const pool = await conn;
        const query = "EXEC PAYMENT_BY_COMPANY @id, @year";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getApplicationsByCompany = async function(param, result) {
        const pool = await conn;
        const query = "EXEC APPLICATIONS_BY_COMPANY @id, @year";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getPostsByCompany = async function(param, result) {
        const pool = await conn;
        const query = "EXEC POSTS_BY_COMPANY @id, @year";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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

    this.getTopAppliedPostByCompany = async function(param, result) {
        const pool = await conn;
        const query = "EXEC TOP_APPLIED_POST_BY_COMPANY @id, @year";
        return await pool.request()
            .input("id", sql.Int, param.id)
            .input("year", sql.Int, param.year)
            .query(query, function(err, data) {
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
}