const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbconfig = require("./config/dbconfig")
const port = process.env.PORT || 5001;

const adminRoute = require("./routes/adminRoute");
const appartmentRoute = require("./routes/appartmentRoute");
const authRoute = require("./routes/authRoute");
const branchRoute = require("./routes/branchRoute");
const buildingRoute = require ("./routes/buildingRoute");
const flatRoute = require ("./routes/flatRoute");
const landlordRoute = require ("./routes/landlordRoute");
const lanMsgs = require("./routes/landlordmsgRoute");
const tenantMsgs = require ("./routes/tenantmsgRoute");
const tenantRoute = require("./routes/tenantRoute");
const userRoute = require("./routes/usersRoute");
const verificationRoute = require("./routes/verificationRoute");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.set("view engine", "pug");
app.set("views", path.join( __dirname ,"views"));
app.use(cookieParser())

// middleware
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/appartments", appartmentRoute)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/branch", branchRoute);
app.use("/api/v1/buildings", buildingRoute);
app.use("/api/v1/flats", flatRoute);
app.use("/api/v1/landlord", landlordRoute); 
app.use("/api/v1/lanmsgs", lanMsgs);
app.use("/api/v1/tenmsgs", tenantMsgs);
app.use("/api/v1/tenants", tenantRoute); 
app.use("/api/v1/users", userRoute);
app.use("/api/v1/verification", verificationRoute);

app.listen(port, ()=> console.log(`server running on port ${port}`))

//IcCVIJ2cdcgVBeRW // url: mongodb+srv://uwaaustin10:<password>@cluster0.mxbay0e.mongodb.net/

//1qVm8d80rQyuepZa