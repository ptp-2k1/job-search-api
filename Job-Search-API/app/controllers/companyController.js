const Company = require("../models/companyModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new Company();
const authentication = new Authentication();

exports.getAll= function(req, res) {
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

exports.getAdminDetail = function(req, res) {
    model.getAdminDetail(req.params.id, function (status, data, message, error) {
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

exports.getDetailFile = function(req, res) {
    authentication.authentication(req, req.body.role, model.getDetailFile, req.body, function (status, data, message, error) {
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
    authentication.authentication(req, 1, model.filter, req.body, function (status, data, message, error) {
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
    authentication.authentication(req, 1, model.changeStatus, req.body, function (status, data, message, error) {
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

exports.checkStatus = function(req, res) {
    authentication.authentication(req, 2, model.checkStatus, req.body, function (status, data, message, error) {
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

exports.createImage = function(req, res) {
    authentication.authentication(req, 2, model.createImage, req.body, function (status, data, message, error) {
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

exports.updateImage = function(req, res) {
    authentication.authentication(req, 2, model.updateImage, req.body, function (status, data, message, error) {
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

exports.getImage = function(req, res) {
    authentication.authentication(req, 2, model.getImage, req.body, function (status, data, message, error) {
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