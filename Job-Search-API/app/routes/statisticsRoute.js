const Controller = require("../controllers/statiscticsController");

module.exports = function(app) {
    app.post("/statistics/category-data", Controller.getCategoryData);
    app.post("/statistics/revenue-by-year-total", Controller.getRevenueByYearTotal);
    app.post("/statistics/posts-by-year-total", Controller.getPostsByYearTotal);
    app.post("/statistics/applications-by-year-total", Controller.getApplicationsByYearTotal);
    app.post("/statistics/top-recruitment-branch", Controller.getTopRecruitmentBranch);
    app.post("/statistics/top-recruitment-company", Controller.getTopRecruitmentCompany);
    app.post("/statistics/top-application-company", Controller.getTopApplicationCompany);
    app.post("/statistics/top-purchase-company", Controller.getTopPurchaseCompany);
    app.post("/statistics/top-purchased-package", Controller.getTopPurchasedPackage);
    app.post("/statistics/payment-by-company", Controller.getPaymentByCompany);
    app.post("/statistics/applications-by-company", Controller.getApplicationsByCompany);
    app.post("/statistics/posts-by-company", Controller.getPostsByCompany);
    app.post("/statistics/top-applied-post-by-company", Controller.getTopAppliedPostByCompany);
}