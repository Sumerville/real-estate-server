const mongoose = require("mongoose");
const landlordSchema = new mongoose.Schema({
   userName:{
    type:String,
   },
   email:{
    type:String,
   },
   password:{
    type:String,
   },
   address:{
    type:String,
   },
   isDeleted: {
    type: Boolean,
    default: false
},
   createdAt:{
    type:Date,
    default:Date.now,
}
});
const landlord = mongoose.model("landlords", landlordSchema)

module.exports = landlord