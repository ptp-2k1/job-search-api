const Controller = require("../controllers/salaryController");

module.exports = function(app) {
    app.get("/salary", Controller.getAll);
    app.post("/salary/filter", Controller.filter);
    app.post("/salary/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/salary-create", Controller.create);
    app.post("/salary-detail", Controller.getDetail);
    app.put("/salary-update", Controller.update);
    app.post("/salary/check-delete", Controller.checkDelete);
    app.delete("/salary-delete/:id", Controller.delete);
}