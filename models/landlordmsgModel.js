const mongoose = require("mongoose");
const lanmsgSchema = new mongoose.Schema({
    landlordId:{
        type:String,
        ref:"landlords"
    },
    branchId:{
        type:String,
        ref:"branches"
    },
    tenantId:{
        type:String,
        ref:"tenants"
    },
    message:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const lanmsg = mongoose.model("lanmsgs", lanmsgSchema)
module.exports = lanmsg