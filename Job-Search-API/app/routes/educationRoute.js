const Controller = require("../controllers/educationController");

module.exports = function(app) {
    app.get("/education", Controller.getAll);
    app.post("/education/filter", Controller.filter);
    app.post("/education/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/education-create", Controller.create);
    app.post("/education-detail", Controller.getDetail);
    app.put("/education-update", Controller.update);
    app.post("/education/check-delete", Controller.checkDelete);
    app.delete("/education-delete/:id", Controller.delete);
}