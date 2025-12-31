const Controller = require("../controllers/packageController");

module.exports = function(app) {
    app.post("/package/filter", Controller.filter)
    app.post("/package", Controller.getAll)
    app.put("/package/change-status", Controller.changeStatus)
    app.post("/package/check-duplicate/name", Controller.checkDuplicateName);
    app.post("/package-create", Controller.create);
    app.post("/package-detail", Controller.getDetail);
    app.post("/package/check-applied-package", Controller.checkAppliedPackage);
    app.put("/package-update", Controller.update);
    app.delete("/package-delete/:id", Controller.delete);
}