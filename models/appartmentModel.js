const mongoose = require("mongoose");
const appartmentSchema = new mongoose.Schema({
    buildingId: {
        type: [String],
        ref: "buildings"
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
    decs: {
        type: String,

    },
    appartmentNum: {
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

const appartment = mongoose.model("appartments", appartmentSchema)
module.exports = appartment