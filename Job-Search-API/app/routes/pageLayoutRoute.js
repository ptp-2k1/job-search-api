const Controller = require("../controllers/pageLayoutController");

module.exports = function(app) {
    app.post("/page-layout", Controller.getAll);
}