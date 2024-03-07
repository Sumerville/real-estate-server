const mongoose = require("mongoose");
const flatSchema = new mongoose.Schema({
    buildingId: {
        type: String,
       
    },
    owner:{
        type: Array,
        default:[]
    },
    title: {
        type: String,
        required: true
    },
    oldPrice: {
        type: String,
        required: true
    },
    newPrice: {
        type: String,
        required: true
    },
    desc: {
        type: String,

    },
    flatNum: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const flat = mongoose.model("flats", flatSchema)
module.exports = flat