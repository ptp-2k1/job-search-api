const Controller = require("../controllers/postPackagesController");

module.exports = function(app) {
    app.post("/post-packages-create", Controller.create)
}