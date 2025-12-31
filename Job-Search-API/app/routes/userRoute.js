const Controller = require("../controllers/userController");

module.exports = function(app) {
    app.post("/user/verify-token", Controller.verifyToken);
    app.post("/user/login", Controller.login);
    app.post("/user/check-duplicate/account", Controller.checkDuplicateAccount);
    app.post("/user/check-duplicate/phone-number", Controller.checkDuplicatePhoneNumber);
    app.post("/user/check-duplicate/email", Controller.checkDuplicateEmail);
    app.post("/user/create", Controller.create);
    app.post("/user/reset-password/:email", Controller.resetPassword);
    app.post("/user/filter-staff", Controller.filterStaff);
    app.post("/user/filter-user", Controller.filterUser)
    app.put("/user/change-status", Controller.changeStatus)
    app.post("/user-detail", Controller.getDetail);
    app.put("/user-update", Controller.update);
    app.post("/user/check-password", Controller.checkPassword);
    app.put("/user/change-password", Controller.changePassword);
    app.post("/user/create-avatar", Controller.createAvatar);
    app.put("/user/update-avatar", Controller.updateAvatar);
    app.post("/user/get-avatar", Controller.getAvatar);
}