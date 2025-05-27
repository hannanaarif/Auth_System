import { hash } from "bcrypt";
import mongoose from "mongoose";
import {compareValue, hashValue} from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    varified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema =new mongoose.Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    varified: {
        type: Boolean,
        required: true,
        default: false,
    },

}, {
    timestamps: true,
})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await hashValue(this.password);
    next();
}) 

UserSchema.methods.comparePassword = async function (password: string) {
    const isMatch = await compareValue(password,this.password);
    return isMatch;
}   

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;