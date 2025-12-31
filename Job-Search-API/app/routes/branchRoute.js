const Controller = require("../controllers/branchController");

module.exports = function(app) {
    app.get("/branch", Controller.getAll);
    app.post("/branch/filter", Controller.filter);
    app.post("/branch/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/branch-create", Controller.create);
    app.post("/branch-detail", Controller.getDetail);
    app.put("/branch-update", Controller.update);
    app.post("/branch/check-delete", Controller.checkDelete);
    app.delete("/branch-delete/:id", Controller.delete);
}