const Controller = require("../controllers/authorizationController");

module.exports = function(app) {
    app.post("/authorization/get-roles/:id", Controller.getRoles);
    app.post("/authorization/check-route", Controller.checkRoute);
    app.post("/authorization/assign-roles", Controller.assignRoles);
}