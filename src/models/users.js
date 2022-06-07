import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: String,
    type: String,
    active: Boolean,
    changePassword: Boolean,
    username: { type: String, unique: true },
    userDisplayName: String,
    password: String,
    email: { type: String, unique: true },
    registerHash: String,
});

const User = mongoose.model("User", userSchema);

export { User };
