const {conn, sql} = require("../config/databaseConnection");
const {Status} = require("../enums/Status")
const {Message} = require("../enums/Message")
const jwt = require("jsonwebtoken")

module.exports = function() {
    this.authentication = async function(req, roleId, func, param, result) {
        const authHeader = req.header("authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if(token === null) {
            result(Status.Unauthorized, null, Message.Unauthorized, err);
        } else {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
                if(!err) {
                    const pool = await conn;
                    let query = "IF EXISTS(SELECT * FROM [User] Where Account = @account AND RoleId = @roleId " +
                        "AND Status = 1) SELECT 1 AS Result ELSE SELECT 0 AS Result";
                    return await pool.request()
                        .input("account", sql.VarChar, user.account)
                        .input("roleId", sql.Int, roleId)
                        .query(query, async function(err, data) {
                            if(!err) {
                                if(data.recordset[0].Result === 1) {
                                    func(param, result)
                                } else {
                                    result(Status.Forbidden, null, Message.Forbidden, err);
                                }
                            }else {
                                result(Status.InternalServerError, null, Message.Error, err);
                            }
                        });
                } else {
                    result(Status.Unauthorized, null, Message.Unauthorized, err);
                }
            })
        }
    }
}