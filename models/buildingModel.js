const mongoose = require("mongoose");
const buildingSchema = new mongoose.Schema({
    property: {
        type: String,
        uppercase: true,
    },
    buildingType: {
        type: String,
        uppercase: true,
    },
    buildingCategory: {
        type: String,
        uppercase: true,
    },
    landlordId: {
        type: String,
        ref: "landlords"
    },
    branchId: {
        type: String,
        ref: "branches"
    },
    bathRoom: {
        type: String,
    },
    bedRoom: {
        type: String,
    },
    size: {
        type: String,
    },
    location: {
        type: String,
    },
    address: {
        type: String,
    },
    oldPrice: {
        type: String,
    },
    newPrice: {
        type: String,
    },
    review: {
        type: String,
    },
    rating: {
        type: String,
    },
    desc: {
        type: String,
    },
    pix: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const building = mongoose.model("buildings", buildingSchema)
module.exports = building