const Controller = require("../controllers/postPriorityController");

module.exports = function(app) {
    app.post("/post-priority", Controller.getAll);
}