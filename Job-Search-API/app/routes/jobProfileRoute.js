const Controller = require("../controllers/jobProfileController");

module.exports = function(app) {
    app.post("/job-profile", Controller.getDetail);
    app.post("/job-profile-create", Controller.create);
    app.put("/job-profile-update", Controller.update);
    app.post("/job-profile/search-profile", Controller.searchProfile)
    app.post("/job-profile/view-profile", Controller.viewProfile);
    app.put("/job-profile/off-shared", Controller.offShared);
}