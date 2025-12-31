const Controller = require("../controllers/applyJobsController");

module.exports = function(app) {
    app.post("/apply-jobs/candidate", Controller.getCandidate);
    app.post("/apply-jobs/candidate-detail", Controller.getCandidateDetail);
    app.post("/apply-jobs/check-duplicate", Controller.checkDuplicate);
    app.post("/apply-jobs-create", Controller.create);
    app.post("/apply-jobs/latest-application", Controller.getLatestApplication);
    app.post("/apply-jobs/post-application", Controller.getPostApplication);
    app.put("/apply-jobs/change-status", Controller.changeStatus);
}