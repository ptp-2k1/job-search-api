const Controller = require("../controllers/titleController");

module.exports = function(app) {
    app.get("/title", Controller.getAll);
    app.post("/title/filter", Controller.filter);
    app.post("/title/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/title-create", Controller.create);
    app.post("/title-detail", Controller.getDetail);
    app.put("/title-update", Controller.update);
    app.post("/title/check-delete", Controller.checkDelete);
    app.delete("/title-delete/:id", Controller.delete);
}