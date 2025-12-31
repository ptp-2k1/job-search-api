const PostPackages = require("../models/postPackagesModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new PostPackages();
const authentication = new Authentication();

exports.create = function(req, res) {
    authentication.authentication(req, 2, model.create, req.body, function (status, data, message, error) {
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