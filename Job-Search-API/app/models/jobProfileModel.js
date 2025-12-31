const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getDetail = async function(param, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM [JobProfile] WHERE UserId=@id) SELECT * FROM [JobProfile] " +
            "WHERE UserId=@id ELSE SELECT 1 AS Result";
        return await pool.request()
            .input("id", sql.Int, param.id)
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

    this.create = async function(param, result) {
        const pool = await conn;
        const query = "INSERT INTO [JobProfile] (BranchId, EducationId, TitleId, WorkTypeId, SalaryId, " +
            "ExperienceId, IsShared, SkillDescription, JobWish, UserId) VALUES (@branchId, @educationId, " +
            "@titleId, @workTypeId, @salaryId, @experienceId, @isShared, @skillDescription, @jobWish, @userId)";
        return await pool.request()
            .input("branchId", sql.Int, param.branchId)
            .input("educationId", sql.Int, param.educationId)
            .input("titleId", sql.Int, param.titleId)
            .input("workTypeId", sql.Int, param.workTypeId)
            .input("salaryId", sql.Int, param.salaryId)
            .input("experienceId", sql.Int, param.experienceId)
            .input("isShared", sql.Bit, param.isShared)
            .input("skillDescription", sql.NVarChar, param.skillDescription)
            .input("jobWish", sql.NVarChar, param.jobWish)
            .input("userId", sql.Int, param.userId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.update = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [JobProfile] SET BranchId=@branchId, EducationId=@educationId, TitleId=@titleId, " +
            "WorkTypeId=@workTypeId, SalaryId=@salaryId, ExperienceId=@experienceId, IsShared=@isShared, " +
            "SkillDescription=@skillDescription, JobWish=@jobWish WHERE Id=@id";
        return await pool.request()
            .input("branchId", sql.Int, param.branchId)
            .input("educationId", sql.Int, param.educationId)
            .input("titleId", sql.Int, param.titleId)
            .input("workTypeId", sql.Int, param.workTypeId)
            .input("salaryId", sql.Int, param.salaryId)
            .input("experienceId", sql.Int, param.experienceId)
            .input("isShared", sql.Bit, param.isShared)
            .input("skillDescription", sql.NVarChar, param.skillDescription)
            .input("jobWish", sql.NVarChar, param.jobWish)
            .input("id", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.searchProfile = async function(param, result) {
        const all = " IS NOT NULL ";
        const branchId = param.branchId !== "" ? " = " + param.branchId.toString() : all;
        const educationId = param.educationId !== "" ? " = " + param.educationId.toString() : all;
        const titleId = param.titleId !== "" ? " = " + param.titleId.toString() : all;
        const workTypeId = param.workTypeId !== "" ? " = " + param.workTypeId.toString() : all;
        const salaryId = param.salaryId !== "" ? " = " + param.salaryId.toString() : all;
        const experienceId = param.experienceId !== "" ? " = " + param.experienceId.toString() : all;
        const pool = await conn;
        const query = "SELECT TOP " + param.amount + " MIN([JobProfile].Id) AS Id, " +
            "MIN(LastName + ' ' + FirstName) AS FullName, Gender, Email, PhoneNumber, [JobProfile].UserId AS " +
            "UserId, MAX(UploadDate) AS UploadDate FROM [JobProfile] INNER JOIN [User] ON " +
            "[JobProfile].UserId = [User].Id INNER JOIN [CandidateCv] ON [JobProfile].UserId = " +
            "[CandidateCv].UserId WHERE BranchId" + branchId + " AND EducationId" + educationId + " AND " +
            "TitleId" + titleId + " AND WorkTypeId" + workTypeId + " AND SalaryId" + salaryId + " AND " +
            "ExperienceId" + experienceId + " AND IsShared = 1 GROUP BY [JobProfile].UserId, " +
            "LastName + ' ' + FirstName, Gender, Email, PhoneNumber ORDER BY MAX(UploadDate) DESC";
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

    this.viewProfile = async function(param, result) {
        const pool = await conn;
        const query = "SELECT [Branch].Name AS Branch, [Education].Name AS Education, [Title].Name " +
            "AS Title, [WorkType].Name AS WorkType, [Salary].Name AS Salary, [Experience].Name AS " +
            "Experience, SkillDescription, JobWish, [JobProfile].UserId FROM [JobProfile], " +
            "[Branch], [Education], [Title], [WorkType], [Salary], [Experience] WHERE " +
            "[JobProfile].Id = @id AND [JobProfile].BranchId = [Branch].Id AND " +
            "[JobProfile].EducationId = [Education].Id AND [JobProfile].TitleId = [Title].Id AND " +
            "[JobProfile].WorkTypeId = [WorkType].Id AND [JobProfile].SalaryId = [Salary].Id AND " +
            "[JobProfile].ExperienceId = [Experience].Id";
        return await pool.request()
            .input("id", sql.Int, param.id)
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

    this.offShared = async function(param, result) {
        const pool = await conn;
        const query = "UPDATE [JobProfile] SET IsShared=0 WHERE UserId=@userId";
        return await pool.request()
            .input("userId", sql.Int, param.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }
}