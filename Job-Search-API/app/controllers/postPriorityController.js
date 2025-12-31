const PostPriority = require("../models/postPriorityModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new PostPriority();
const authentication = new Authentication();

exports.getAll = function(req, res) {
    authentication.authentication(req, 2, model.getAll, null, function (status, data, message, error) {
        res.send({
            status: status,
            data: data,
            message: message,
            error: error
        })
    }).then(value => {
        console.log(value);
    });
};