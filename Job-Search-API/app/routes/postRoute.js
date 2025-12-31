const Controller = require("../controllers/postController");

module.exports = function(app) {
    app.get("/post/top-hot", Controller.getTopHot);
    app.get("/post/latest", Controller.getLatest);
    app.get("/post/company/:id", Controller.getByCompany);
    app.post("/post", Controller.getAll);
    app.get("/post/detail/:id", Controller.getDetail);
    app.post("/post/staff-filter", Controller.staffFilter);
    app.put("/post/change-status", Controller.changeStatus)
    app.post("/post/recommended", Controller.getRecommended);
    app.post("/post/recruiter-filter", Controller.recruiterFilter);
    app.post("/post/recruiter-detail", Controller.getRecruiterDetail);
    app.post("/post-create", Controller.create)
    app.post("/post/latest-id", Controller.getLatestId)
    app.put("/post-update", Controller.update)
}