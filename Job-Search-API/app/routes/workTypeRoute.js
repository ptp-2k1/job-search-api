const Controller = require("../controllers/workTypeController");

module.exports = function(app) {
    app.get("/work-type", Controller.getAll);
    app.post("/work-type/filter", Controller.filter);
    app.post("/work-type/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/work-type-create", Controller.create);
    app.post("/work-type-detail", Controller.getDetail);
    app.put("/work-type-update", Controller.update);
    app.post("/work-type/check-delete", Controller.checkDelete);
    app.delete("/work-type-delete/:id", Controller.delete);
}