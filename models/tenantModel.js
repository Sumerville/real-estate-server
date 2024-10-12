const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    city: {
        type: String,

    },
    mobile: {
        type: String,
    },
    userId: {
        type: String,
        ref: "users"
    },
    landlordId: {
        type: String,
        ref: "landlords"
    },
    branchId: {
        type: String,
        ref: "branches"
    },
    buildingId: {
        type: String,
        ref: "buildings"
    },
    flatId: {
        type: String,
        ref: "flats"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    rentage: {
        type: String,
    },
    dueDate: {
        type: String,
    },
    photo: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const tenant = mongoose.model("tenants", tenantSchema)
module.exports = tenant