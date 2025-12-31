const Controller = require("../controllers/candidateCvController");

module.exports = function(app) {
    app.post("/candidate-cv/latest", Controller.getLatest);
    app.post("/candidate-cv/filter", Controller.filter);
    app.post("/candidate-cv-content", Controller.getContent);
    app.post("/candidate-cv-upload", Controller.create);
    app.delete("/candidate-cv-delete/:id", Controller.delete);
    app.post("/candidate-cv/check-duplicate/name", Controller.checkDuplicateName);
}