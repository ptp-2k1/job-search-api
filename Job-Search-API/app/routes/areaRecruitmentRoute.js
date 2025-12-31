const Controller = require("../controllers/areaRecruitmentController");

module.exports = function(app) {
    app.get("/area-recruitment/detail/:id", Controller.getDetail);
    app.post("/area-recruitment-create", Controller.create)
    app.put("/area-recruitment-update", Controller.update)
}