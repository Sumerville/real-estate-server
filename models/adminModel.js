const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
userName:{
    type:String,
},
landlordId:{
    type:String,
    ref:"landlords"
},
branchId:{
    type:String,
    ref:"branches"
},
email:{
    type:String,
},
password:{
    type:String,
},
isDeleted: {
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