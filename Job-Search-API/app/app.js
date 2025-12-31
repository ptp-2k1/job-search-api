const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(bodyParser.json({limit: "50mb"}));
app.use(cors({
    origin: "*",
    method: ["GET", "POST", "PUT", "DELETE"]
}));

require("./routes/applyJobsRoute")(app);
require("./routes/areaRecruitmentRoute")(app);
require("./routes/areaRoute")(app);
require("./routes/authorizationRoute")(app);
require("./routes/branchRecruitmentRoute")(app);
require("./routes/branchRoute")(app);
require("./routes/candidateCvRoute")(app);
require("./routes/companyRoute")(app);
require("./routes/educationRoute")(app);
require("./routes/experienceRoute")(app);
require("./routes/jobProfileRoute")(app);
require("./routes/pageLayoutRoute")(app);
require("./routes/packageRoute")(app);
require("./routes/postPackagesRoute")(app);
require("./routes/postPriorityRoute")(app);
require("./routes/postRoute")(app);
require("./routes/purchasedPackageRoute")(app);
require("./routes/roleRoute")(app);
require("./routes/salaryRoute")(app);
require("./routes/statisticsRoute")(app);
require("./routes/titleRoute")(app);
require("./routes/userRoute")(app);
require("./routes/workTypeRoute")(app);

app.listen(5000);