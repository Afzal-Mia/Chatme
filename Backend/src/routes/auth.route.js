import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Define routes
router.post("/signup", signup); // Route for user signup
router.post("/login", login);   // Route for user login
router.post("/logout", logout); // Route for user logout
router.put("/update-profile",protectRoute,updateProfile)// Route for user profile update
router.get("/check",protectRoute,checkAuth)

export default router;
