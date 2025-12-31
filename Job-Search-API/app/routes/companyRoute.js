const Controller = require("../controllers/companyController");

module.exports = function(app) {
    app.post("/company/", Controller.getAll);
    app.get("/company-admin-detail/:id", Controller.getAdminDetail);
    app.post("/company-recruiter-detail", Controller.getRecruiterDetail);
    app.post("/company-detail/file", Controller.getDetailFile);
    app.post("/company/filter", Controller.filter)
    app.put("/company/change-status", Controller.changeStatus)
    app.post("/company-create", Controller.create);
    app.put("/company-update", Controller.update);
    app.post("/company/check-status", Controller.checkStatus);
    app.post("/company/create-image", Controller.createImage);
    app.put("/company/update-image", Controller.updateImage);
    app.post("/company/get-image", Controller.getImage);
}