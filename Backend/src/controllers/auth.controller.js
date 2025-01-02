import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All The fields are required!" });
        }
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "This email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user document
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token
        generateToken(newUser._id, res);

        // Respond with user details (excluding sensitive info like password)
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        // If user doesn't exist, return error
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare the provided password with the stored hash
        const result = await bcrypt.compare(password, user.password);
        
        // If password doesn't match, return error
        if (!result) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
       
        // Generate JWT token for the user and set it in a cookie
        generateToken(user._id, res);

        // Send successful response with user data (except password)
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            profilePic: user.profilePic // Do not include password in the response
        });
    } catch (error) {
        // Log the error and send a generic server error response
        console.log("An error occurred during login:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged Out Successfully"});
  }
  catch(error){
console.log("Error Logging Out",error.message);
  }
};

export const updateProfile=async (req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required!"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);

    }
    catch(err){
        console.log("Error in Updating the profile",err.message);
        return res.status(500).json({message:"Internal Server Error"});

    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check Auth",error.message);
        return res.status(500).json({message:"Internal Server Error"});

    }
}