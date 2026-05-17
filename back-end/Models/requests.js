const mongoose = require("mongoose");

const RequestsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    reason: {
        type: String,
        required: true,
        lowercase: true
    },
    priority: {
        type: Number,
        enum: [1,2,3],
        required: true,
    },
    wizard: {
        type: String,
        default: "",
    },
    details: {
        type: String,
        lowercase: true,
        maxlength: 50,
    },
    wizardRes: {
        type: Boolean,
        default: false,
    },
    agentRes: {
        type: Boolean,
        default: false
    },
    Timeer: {
        time_recieve: {
            type: String,
            default: ""
        },
        time_ending: {
            type: String,
            default: ""
        }
    }
})

const Request = mongoose.model("request", RequestsSchema);

module.exports = Request;