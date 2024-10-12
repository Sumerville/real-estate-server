const mongoose = require("mongoose");
const buildingSchema = new mongoose.Schema({
    title: {
        type: String,
        uppercase: true,
    },
    propertyType: {
        type: String,
        uppercase: true,
    },
    buildingCategory: {
        type: String,
        uppercase: true,
    },
    landlordId: {
        type: String,
        ref: "admins"
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
    buildingSize: {
        type: String,
    },
    situated: {
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
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    desc: {
        type: String,
    },
    pix: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
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
