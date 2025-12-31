const Post = require("../models/postModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new Post();
const authentication = new Authentication();

exports.getTopHot = function(req, res) {
    model.getTopHot(null, function (status, data, message, error) {
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

exports.getLatest = function(req, res) {
    model.getLatest(null, function (status, data, message, error) {
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

exports.getByCompany = function(req, res) {
    model.getByCompany(req.params.id, function (status, data, message, error) {
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

exports.getAll = function(req, res) {
    model.getAll(req.body, function (status, data, message, error) {
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

exports.getDetail = function(req, res) {
    model.getDetail(req.params.id, function (status, data, message, error) {
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

exports.staffFilter = function(req, res) {
    authentication.authentication(req, 1, model.staffFilter, req.body, function (status, data, message, error) {
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

exports.changeStatus = function(req, res) {
    authentication.authentication(req, req.body.role, model.changeStatus, req.body, function (status, data, message, error) {
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

exports.getRecommended = function(req, res) {
    authentication.authentication(req, 3, model.getRecommended, req.body, function (status, data, message, error) {
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

exports.recruiterFilter = function(req, res) {
    authentication.authentication(req, 2, model.recruiterFilter, req.body, function (status, data, message, error) {
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

exports.getRecruiterDetail = function(req, res) {
    authentication.authentication(req, 2, model.getRecruiterDetail, req.body, function (status, data, message, error) {
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

exports.getLatestId = function(req, res) {
    authentication.authentication(req, 2, model.getLatestId, null, function (status, data, message, error) {
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

exports.update = function(req, res) {
    authentication.authentication(req, 2, model.update, req.body, function (status, data, message, error) {
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