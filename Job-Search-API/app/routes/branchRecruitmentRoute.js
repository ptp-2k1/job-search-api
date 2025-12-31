const Controller = require("../controllers/branchRecruitmentController");

module.exports = function(app) {
    app.get("/branch-recruitment/detail/:id", Controller.getDetail);
    app.post("/branch-recruitment-create", Controller.create)
    app.put("/branch-recruitment-update", Controller.update)
}