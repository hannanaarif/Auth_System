import mongoose from "mongoose";
import VerificationCodeType from "../constants/varificationcodeType";


export interface VerificationCodeDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type:VerificationCodeType;
    expiresAt: Date;
}

const VerificationCode = new mongoose.Schema<VerificationCodeDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
    type: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>("VerificationCode", VerificationCode,"Verification_Code");

export default VerificationCodeModel;