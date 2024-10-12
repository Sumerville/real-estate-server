const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
   email: {
      type: String, 
   },
   otp:{
      type: String,
      required: true
   },
   expireIn: {
      type: Number, 
   },
},{timestamps:true});
const OtpCode = mongoose.model("otpCode", otpSchema);

module.exports = OtpCode
