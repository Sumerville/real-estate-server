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
    userId:{
        type:String,
        ref:"users"
    },
    message:{
        type:String,
    },
    appartment:{
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

const tenantmsg = mongoose.model("tenantmsgs", tenantmsgSchema)
module.exports = tenantmsg