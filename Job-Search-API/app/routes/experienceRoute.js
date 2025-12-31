const Controller = require("../controllers/experienceController");

module.exports = function(app) {
    app.get("/experience", Controller.getAll);
    app.post("/experience/filter", Controller.filter);
    app.post("/experience/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/experience-create", Controller.create);
    app.post("/experience-detail", Controller.getDetail);
    app.put("/experience-update", Controller.update);
    app.post("/experience/check-delete", Controller.checkDelete);
    app.delete("/experience-delete/:id", Controller.delete);
}