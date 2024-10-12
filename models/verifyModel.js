const mongoose = require("mongoose");


const verifySchema = new mongoose.Schema({
    email:{type: String, unique: true},
    otp: { type:String},
    createdAt:{
        type: Date,
        default:Date.now
    },
    expiresAt:{
        type:Date
    }
});

const VerifyCode = mongoose.model("verifyCode", verifySchema);
module.exports = VerifyCode 
