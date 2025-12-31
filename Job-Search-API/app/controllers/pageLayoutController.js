const PageLayout = require("../models/pageLayoutModel");
const Authentication = require("../../middleware/jwtAuthentication");
const model = new PageLayout();
const authentication = new Authentication();

exports.getAll = function(req, res) {
    authentication.authentication(req, 1, model.getAll, null, function (status, data, message, error) {
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


