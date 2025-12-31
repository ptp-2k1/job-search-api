const Statistics = require("../models/statisticsModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new Statistics();
const authentication = new Authentication();

exports.getCategoryData = function(req, res) {
    authentication.authentication(req, 1, model.getCategoryData, null, function (status, data, message, error) {
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

exports.getRevenueByYearTotal = function(req, res) {
    authentication.authentication(req, 1, model.getRevenueByYearTotal, req.body, function (status, data, message, error) {
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

exports.getPostsByYearTotal = function(req, res) {
    authentication.authentication(req, 1, model.getPostsByYearTotal, req.body, function (status, data, message, error) {
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

exports.getApplicationsByYearTotal = function(req, res) {
    authentication.authentication(req, 1, model.getApplicationsByYearTotal, req.body, function (status, data, message, error) {
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

exports.getTopRecruitmentBranch = function(req, res) {
    model.getTopRecruitmentBranch(req.body, function (status, data, message, error) {
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

exports.getTopRecruitmentCompany = function(req, res) {
    authentication.authentication(req, 1, model.getTopRecruitmentCompany, req.body, function (status, data, message, error) {
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

exports.getTopApplicationCompany = function(req, res) {
    authentication.authentication(req, 1, model.getTopApplicationCompany, req.body, function (status, data, message, error) {
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

exports.getTopPurchaseCompany = function(req, res) {
    authentication.authentication(req, 1, model.getTopPurchaseCompany, req.body, function (status, data, message, error) {
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

exports.getTopPurchasedPackage = function(req, res) {
    authentication.authentication(req, 1, model.getTopPurchasedPackage, req.body, function (status, data, message, error) {
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

exports.getPaymentByCompany = function(req, res) {
    authentication.authentication(req, 2, model.getPaymentByCompany, req.body, function (status, data, message, error) {
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

exports.getApplicationsByCompany = function(req, res) {
    authentication.authentication(req, 2, model.getApplicationsByCompany, req.body, function (status, data, message, error) {
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

exports.getPostsByCompany = function(req, res) {
    authentication.authentication(req, 2, model.getPostsByCompany, req.body, function (status, data, message, error) {
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

exports.getTopAppliedPostByCompany = function(req, res) {
    authentication.authentication(req, 2, model.getTopAppliedPostByCompany, req.body, function (status, data, message, error) {
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