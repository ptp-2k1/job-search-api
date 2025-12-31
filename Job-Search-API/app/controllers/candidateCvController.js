const CandidateCv = require("../models/candidateCvModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new CandidateCv();
const authentication = new Authentication();

exports.getLatest = function(req, res) {
    authentication.authentication(req, req.body.role, model.getLatest, req.body.id, function (status, data, message, error) {
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

exports.filter = function(req, res) {
    authentication.authentication(req, 3, model.filter, req.body, function (status, data, message, error) {
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

exports.getContent = function(req, res) {
    authentication.authentication(req, 3, model.getContent, req.body.id, function (status, data, message, error) {
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

exports.create = function(req, res) {
    authentication.authentication(req, 3, model.create, req.body, function (status, data, message, error) {
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

exports.delete = function(req, res) {
    authentication.authentication(req, 3, model.delete, req.params.id, function (status, data, message, error) {
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

exports.checkDuplicateName = function(req, res) {
    authentication.authentication(req, 3, model.checkDuplicateName, req.body, function (status, data, message, error) {
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
