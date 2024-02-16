const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on("connected", ()=>{
    console.log("mongodb connected");
})

connection.on("error", ()=>{
    console.log("mongodb connection failed");
})


module.exports = connection;