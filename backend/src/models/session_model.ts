import mongoose from "mongoose";
import { thirthydayfromNow } from "../utils/date";

interface SessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}


const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
    userAgent: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default:thirthydayfromNow,
    }
}, {
    timestamps: true,
})

const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema, "Session");

export default SessionModel;