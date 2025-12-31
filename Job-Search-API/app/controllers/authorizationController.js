const Authorization = require("../models/authorizationModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new Authorization();
const authentication = new Authentication();

exports.getRoles = function(req, res) {
    authentication.authentication(req, 1, model.getRoles, req.params.id, function (status, data, message, error) {
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

exports.checkRoute = function(req, res) {
    authentication.authentication(req, 1, model.checkRoute, req.body, function (status, data, message, error) {
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

exports.assignRoles = function(req, res) {
    authentication.authentication(req, 1, model.assignRoles, req.body, function (status, data, message, error) {
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