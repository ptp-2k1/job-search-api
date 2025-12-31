const Controller = require("../controllers/purchasedPackageController");

module.exports = function(app) {
    app.post("/purchased-package/admin-filter", Controller.adminFilter)
    app.put("/purchased-package/change-status", Controller.changeStatus)
    app.post("/purchased-package/detail", Controller.getDetail)
    app.post("/purchased-package/recruiter-filter", Controller.recruiterFilter)
    app.post("/purchased-package-create", Controller.create)
    app.post("/purchased-package/profile-search-amount", Controller.getProfileSearchAmount)
    app.post("/purchased-package/available", Controller.getAvailable)
    app.post("/purchased-package/image", Controller.getDetailImage);
}