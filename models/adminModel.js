const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
userName:{
    type:String,
},
landlordId:{
    type:String,
    ref:"landlords",
    default: "653b94d73c3207e6949bc212",
},
branchId:{
    type:String,
    ref:"branches",
    default: "653b94d73c3207e6949bc212",
},
email:{
    type:String,
},
role: {
    type: String,
    enum: ["ADMIN", "LANDLORD", "BRANCH",],
    uppercase: true,
  },
  address:{
type:String,
  },
  phone:{
    type:String,
      },
password:{
    type:String,
},
isDeleted: {
    type: Boolean,
    default: false
},
isVerified: {
    type: Boolean,
    default: false
},
createdAt:{
    type:Date,
    default:Date.now
}
})
const admin = mongoose.model("admins", adminSchema)
module.exports = admin