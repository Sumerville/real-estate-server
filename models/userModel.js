const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    city: {
        type: String,

    },
    mobile: {
        type: String,
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
    appartment: {
        type: String,
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
const user = mongoose.model("users", userSchema)
module.exports = user