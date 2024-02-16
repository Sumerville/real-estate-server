const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
    landlordId: {
        type: String,
        ref: "landlords"
    },
    branchName: {
        type: String,

    },
    address: {
        type: String,
    },
    location: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const branch = mongoose.model("branches", branchSchema)

module.exports = branch