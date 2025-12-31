const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getTopHot = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 10 Logo, [Post].Id, Title, SUM(CASE WHEN [PostPackages].PostId = [Post].Id AND " +
            "[PostPackages].ExpiredDate >= GETDATE() THEN [PostPackages].HotWeight ELSE 0 END) AS Weight, Name, " +
            "ApplyEndDate, UploadDate, UpdateAt FROM [Company], [Post], [PostPackages] WHERE [Company].UserId = " +
            "[Post].UserId AND [Post].Id = [PostPackages].PostId AND [PostPackages].ExpiredDate >= GETDATE() AND [Post].Status = 1" +
            "GROUP BY Logo, [Post].Id, Title, Name, ApplyEndDate, UploadDate, UpdateAt ORDER BY Weight DESC, " +
            "UploadDate ASC, Title ASC";
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

    this.getLatest = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 10 Logo, [Post].Id, Title, SUM(CASE WHEN [PostPackages].PostId = [Post].Id " +
            "AND [PostPackages].ExpiredDate >= GETDATE() THEN [PostPackages].HotWeight ELSE 0 END) AS " +
            "Weight, Name, ApplyEndDate, UploadDate, UpdateAt FROM [Company], [Post], [PostPackages] " +
            "WHERE [Company].UserId = [Post].UserId AND [Post].Id = [PostPackages].PostId " +
            "AND [PostPackages].ExpiredDate >= GETDATE() AND [Post].Status = 1 GROUP BY Logo, [Post].Id, Title, Name, ApplyEndDate, " +
            "UploadDate, UpdateAt ORDER BY UploadDate DESC, Weight DESC, Title ASC";
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

    this.getByCompany = async function(param, result) {
        const pool = await conn;
        const query = "SELECT Logo, [Post].Id, Title, SUM(CASE WHEN [PostPackages].PostId = " +
            "[Post].Id AND [PostPackages].ExpiredDate >= GETDATE() THEN [PostPackages].HotWeight ELSE 0 END) AS " +
            "Weight, [Salary].Name As Salary, [Experience].Name As Experience, ApplyEndDate, " +
            "UploadDate, UpdateAt FROM [Company], [Post], [Salary], [Experience], " +
            "[PostPackages] WHERE [Company].Id = @id AND [Company].UserId = [Post].UserId " +
            "AND [Post].SalaryId = [Salary].Id AND [Post].ExperienceId = [Experience].Id " +
            "AND [Post].Id = [PostPackages].PostId AND [PostPackages].ExpiredDate >= " +
            "GETDATE() AND [Post].Status = 1 GROUP BY Logo, [Post].Id, Title, [Salary].Name, [Experience].Name, ApplyEndDate, " +
            "UploadDate, UpdateAt ORDER BY Weight DESC, UploadDate ASC, Title ASC";
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

    this.getAll = async function(param, result) {
        const all = " IS NOT NULL ";
        const areaId = param.areaId !== "" ? " = " + param.areaId.toString() : all;
        const branchId = param.branchId !== "" ? " = " + param.branchId.toString() : all;
        const educationId = param.educationId !== "" ? " = " + param.educationId.toString() : all;
        const titleId = param.titleId !== "" ? " = " + param.titleId.toString() : all;
        const workTypeId = param.workTypeId !== "" ? " = " + param.workTypeId.toString() : all;
        const salaryId = param.salaryId !== "" ? " = " + param.salaryId.toString() : all;
        const experienceId = param.experienceId !== "" ? " = " + param.experienceId.toString() : all;
        const pool = await conn;
        const query = "SELECT DISTINCT  Logo, Id, Title, Weight, Salary, Experience, ApplyEndDate, UploadDate " +
            "FROM (SELECT Logo, [Post].Id, Title, SUM(CASE WHEN [PostPackages].PostId = [Post].Id AND " +
            "[PostPackages].ExpiredDate >= GETDATE() THEN [PostPackages].HotWeight ELSE 0 END) AS Weight, " +
            "[Salary].Name As Salary, [Experience].Name As Experience, ApplyEndDate, UploadDate FROM [Company], " +
            "[Post], [Salary], [Experience], [PostPackages] WHERE [Company].UserId = [Post].UserId AND " +
            "[Post].ExperienceId = [Experience].Id AND [Post].SalaryId = [Salary].Id AND [Post].Id = " +
            "[PostPackages].PostId AND [PostPackages].ExpiredDate >= GETDATE() AND [Post].Status = 1 AND Title LIKE N'%" + param.info +
            "%' AND EducationId" + educationId + " AND TitleId" + titleId + " AND WorkTypeId" + workTypeId +
            " AND SalaryId" + salaryId + " AND ExperienceId" + experienceId + " GROUP BY Logo, [Post].Id, " +
            "Title, [Salary].Name, [Experience].Name, ApplyEndDate, UploadDate) AS [Result], [AreaRecruitment], " +
            "[BranchRecruitment] WHERE [Result].Id = [AreaRecruitment].PostId AND [Result].Id = " +
            "[BranchRecruitment].PostId AND AreaId" + areaId + " AND BranchId" + branchId + " ORDER BY " +
            "Weight DESC, UploadDate ASC, Title ASC";
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

    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 1 [Company].Id As CompanyId, [Company].Name AS CompanyName, Title, RecruitAmount, " +
            "[Education].Name AS EducationName, [Title].Name AS TitleName, " +
            "[WorkType].Name AS WorkTypeName, [Salary].Name AS SalaryName, " +
            "[Experience].Name AS ExperienceName, RecruitDetail, Requirement, " +
            "[Post].[Right], [Post].Address, [PostPriority].Name AS PostPriorityName, " +
            "ApplyEndDate, UploadDate, UpdateAt, ExpiredDate, LastName + ' ' + FirstName " +
            "AS Recruiter, [Post].Status, [Post].UserId FROM [Education], [Title], " +
            "[WorkType], [Salary], [Experience], [PostPriority], [PostPackages], [User], " +
            "[Post], [Company] WHERE [Post].Id = @id AND [Post].EducationId = " +
            "[Education].Id AND [Post].TitleId = [Title].Id AND [Post].WorkTypeId = " +
            "[WorkType].Id AND [Post].SalaryId = [Salary].Id AND [Post].ExperienceId = " +
            "[Experience].Id AND [Post].PostPriorityId = [PostPriority].Id AND [Post].Id " +
            "= [PostPackages].PostId AND [Post].UserId = [User].Id AND [Company].UserId " +
            "= [Post].UserId ORDER BY [PostPackages].ExpiredDate DESC";
        return await pool.request().input("id", sql.Int, param).query(query, function(err, data) {
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

    this.staffFilter = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? " = " + param.status.toString() : all;
        const pool = await conn;
        const query = "SELECT [Post].Id, Title, UploadDate, Name, " +
            "[Post].Status FROM [Post], [Company] WHERE [Post].UserId = [Company].UserId AND Title LIKE N'%"
            + param.info + "%' AND [Post].Status" + status + " ORDER BY UploadDate DESC";
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
        const query = "UPDATE [Post] SET Status=@status WHERE Id=@id";
        return await pool.request()
            .input("status", sql.Int, param.status)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getRecommended = async function(param, result) {
        const pool = await conn;
        const query = "EXEC RECOMMENDED_JOBS @id";
        return await pool.request().input("id", sql.Int, param.id).query(query, function (err, data) {
            if (!err) {
                if (data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                } else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            } else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.recruiterFilter = async function(param, result) {
        const all = " IS NOT NULL ";
        const status = param.status !== null ? (param.status === 1 ? "[Post].Status = " + param.status.toString() : "([Post].Status = 2 OR [Post].Status = 3) ") : "[Post].Status " + all;
        const priority = param.priority !== null ? " = " + param.priority.toString() + " " : all;
        const pool = await conn;
        const query = "SELECT [Result].Id, Title, UploadDate, Amount, " +
            "MAX([PostPackages].ExpiredDate) AS ExpiredDate, Status FROM (SELECT Id, " +
            "Title, UploadDate, COUNT([ApplyJobs].PostId) AS Amount, Status FROM [Post] " +
            "LEFT JOIN [ApplyJobs] ON [Post].Id = [ApplyJobs].PostId WHERE [Post].UserId " +
            "= @id AND Title LIKE N'%" + param.info + "%' AND " + status +
            "AND [Post].PostPriorityId" + priority + "GROUP BY Id, Title, UploadDate, Status) AS [Result] " +
            "JOIN [PostPackages] ON [Result].Id = [PostPackages].PostId GROUP BY [Result].Id, Title, " +
            "UploadDate, Amount, Status ORDER BY UploadDate DESC";
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

    this.getRecruiterDetail = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 1 [Post].Id, Title, RecruitAmount, EducationId, " +
            "TitleId, WorkTypeId, SalaryId, ExperienceId, RecruitDetail, Requirement, " +
            "[Right], Address, PostPriorityId, ApplyEndDate, UploadDate, UpdateAt, " +
            "[PostPackages].ExpiredDate, [Post].Status, [PurchasedPackage].Id AS " +
            "AppliedPackageId, [Post].UserId FROM [Post], [PurchasedPackage], " +
            "[PostPackages] WHERE [Post].Id = @id AND [Post].Id = [PostPackages].PostId " +
            "AND [PurchasedPackage].Id = [PostPackages].PurchasedPackageId ORDER BY " +
            "[PostPackages].ExpiredDate DESC"
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

    this.create = async function(param, result) {
        const pool = await conn;
        const query = "INSERT INTO [Post] (Title, RecruitAmount, EducationId, TitleId, " +
            "WorkTypeId, SalaryId, ExperienceId, RecruitDetail, Requirement, [Right], " +
            "Address, ApplyEndDate, PostPriorityId, Status, UploadDate, UpdateAt, UserId) " +
            "VALUES (@title, @recruitAmount, @educationId, @titleId, @workTypeId, " +
            "@salaryId, @experienceId, @recruitDetail, @requirement, @right, @address, " +
            "@applyEndDate, @postPriorityId, @status, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, " +
            "@userId)";
        return await pool.request()
            .input("title", sql.NVarChar, param.title)
            .input("recruitAmount", sql.Int, param.recruitAmount)
            .input("educationId", sql.Int, param.educationId)
            .input("titleId", sql.Int, param.titleId)
            .input("workTypeId", sql.Int, param.workTypeId)
            .input("salaryId", sql.Int, param.salaryId)
            .input("experienceId", sql.Int, param.experienceId)
            .input("recruitDetail", sql.NVarChar, param.recruitDetail)
            .input("requirement", sql.NVarChar, param.requirement)
            .input("right", sql.NVarChar, param.right)
            .input("address", sql.NVarChar, param.address)
            .input("applyEndDate", sql.Date, param.applyEndDate)
            .input("postPriorityId", sql.Int, param.postPriorityId)
            .input("status", sql.Int, 1)
            .input("userId", sql.Int, param.userId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getLatestId = async function(param, result) {
        const pool = await conn;
        const query = "SELECT TOP 1 Id From [Post] ORDER BY Id DESC";
        return await pool.request().query(query, function(err, data) {
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
        const query = "UPDATE [Post] SET Title=@title, RecruitAmount=@recruitAmount, " +
            "EducationId=@educationId, TitleId=@titleId, WorkTypeId=@workTypeId, " +
            "SalaryId=@salaryId, ExperienceId=@experienceId, RecruitDetail=@recruitDetail, " +
            "Requirement=@requirement, [Right]=@right, Address=@address, " +
            "ApplyEndDate=@applyEndDate, PostPriorityId=@postPriorityId, " +
            "UpdateAt=CURRENT_TIMESTAMP WHERE Id=@id";
        return await pool.request()
            .input("title", sql.NVarChar, param.title)
            .input("recruitAmount", sql.Int, param.recruitAmount)
            .input("educationId", sql.Int, param.educationId)
            .input("titleId", sql.Int, param.titleId)
            .input("workTypeId", sql.Int, param.workTypeId)
            .input("salaryId", sql.Int, param.salaryId)
            .input("experienceId", sql.Int, param.experienceId)
            .input("recruitDetail", sql.NVarChar, param.recruitDetail)
            .input("requirement", sql.NVarChar, param.requirement)
            .input("right", sql.NVarChar, param.right)
            .input("address", sql.NVarChar, param.address)
            .input("applyEndDate", sql.Date, param.applyEndDate)
            .input("postPriorityId", sql.Int, param.postPriorityId)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }
}