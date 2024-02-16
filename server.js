const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const dbconfig = require("./config/dbconfig")
const port = process.env.PORT || 5001;

const userRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const landlordRoute = require ("./routes/landlordRoute");
const branchRoute = require("./routes/branchRoute");

// middleware

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/landlord", landlordRoute);
app.use("/api/v1/branch", branchRoute);
app.listen(port, ()=> console.log(`server running on port ${port}`))

//IcCVIJ2cdcgVBeRW // url: mongodb+srv://uwaaustin10:<password>@cluster0.mxbay0e.mongodb.net/

//1qVm8d80rQyuepZa