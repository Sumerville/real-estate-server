const mongoose = require("mongoose");
const tenantmsgSchema = new mongoose.Schema({
    landlordId:{
        type:String,
        ref:"landlords"
    },
    branchId:{
        type:String,
        ref:"branches"
    },
    buildingId:{
        type:String,
        ref:"buildings"
    },
    tenantId:{
        type:String,
        ref:"tenants"
    },
    message:{
        type:String,
    },
    appartment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const tenantmsg = mongoose.model("lanmsgs", tenantmsgSchema)
module.exports = tenantmsg