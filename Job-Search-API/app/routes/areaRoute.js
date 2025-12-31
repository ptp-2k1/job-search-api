const Controller = require("../controllers/areaController");

module.exports = function(app) {
    app.get("/area", Controller.getAll);
    app.post("/area/filter", Controller.filter);
    app.post("/area/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/area-create", Controller.create);
    app.post("/area-detail", Controller.getDetail);
    app.put("/area-update", Controller.update);
    app.post("/area/check-delete", Controller.checkDelete);
    app.delete("/area-delete/:id", Controller.delete);
}