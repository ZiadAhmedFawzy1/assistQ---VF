const mongoose = require("mongoose");

const Schema_user = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    name: String,
    status: Boolean,
    job: {
        type: String,
        required: true,
        enum: ["agent", "wizard", "monitor"]
    },
    lastLogin: {
        type: [
        {
            login: String,
            logout: String
        }
    ],
    },
});

const USER = mongoose.model("user", Schema_user);
    
module.exports = USER;