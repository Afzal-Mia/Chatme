import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Correct spelling
        },
        profilePic: {
            type: String,
            default: ""
        }
    },
    { timestamps: true } // Correctly adds `createdAt` and `updatedAt` timestamps
);

const User = mongoose.model("User", userSchema); // Returns a Mongoose model

export default User;
