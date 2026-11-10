
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    refreshTokenHash: {
        type: String,
        default:null
    },

    deviceName: {
        type: String,
        default: "Unknown Device"
    },

    deviceType: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unknown"],
        default: "unknown"
    },

    browser: {
        type: String,
        default: "Unknown"
    },

    operatingSystem: {
        type: String,
        default: "Unknown"
    },

    ipAddress: {
        type: String
    },

    userAgent: {
        type: String
    },

    lastActiveAt: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        required: true,
        index: true
    },

    revoked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
